const prisma = require("../config/database");
const { createBookingSchema } = require("../validators/bookingValidator");
const ActivityLog = require("../models/activityLog");


// POST /api/bookings
// Create a new booking with concurrency-safe seat locking

async function createBooking(req, res, next) {
  try {
    // ----------------------------------------------------------
    // 1. Validate request body
    // ----------------------------------------------------------

    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { showId, seatNumbers } = validation.data;
    const userId = req.user.userId;

    // ----------------------------------------------------------
    // 2. PostgreSQL transaction
    // ----------------------------------------------------------

    const booking = await prisma.$transaction(async (tx) => {
      /*
       * IMPORTANT CONCURRENCY LOGIC
       *
       * FOR UPDATE locks the requested seat rows.
       *
       * If two users simultaneously try to book A5:
       *
       * Request A -> locks A5
       * Request B -> waits
       *
       * Request A -> checks availability -> BOOKED -> COMMIT
       *
       * Request B -> gets the lock -> sees BOOKED -> 409
       *
       * Therefore double booking is prevented at the
       * database transaction level.
       */

      const seats = await tx.$queryRaw`
        SELECT
          id,
          show_id,
          seat_number,
          status
        FROM seats
        WHERE show_id = ${showId}::uuid
          AND seat_number = ANY(${seatNumbers}::text[])
        FOR UPDATE
      `;

      // --------------------------------------------------------
      // 3. Make sure every requested seat exists
      // --------------------------------------------------------

      if (seats.length !== seatNumbers.length) {
        throw new Error("ONE_OR_MORE_SEATS_NOT_FOUND");
      }

      // --------------------------------------------------------
      // 4. Check whether seats are already booked
      // --------------------------------------------------------

      const unavailableSeats = seats.filter(
        (seat) => seat.status !== "AVAILABLE"
      );

      if (unavailableSeats.length > 0) {
        const names = unavailableSeats
          .map((seat) => seat.seat_number)
          .join(", ");

        throw new Error(`SEATS_ALREADY_BOOKED:${names}`);
      }

      // --------------------------------------------------------
      // 5. Create booking
      // --------------------------------------------------------

      const newBooking = await tx.booking.create({
        data: {
          userId,
          showId,
          status: "CONFIRMED",
        },
      });

      // --------------------------------------------------------
      // 6. Create booking-seat relationships
      // --------------------------------------------------------

      await tx.bookingSeat.createMany({
        data: seats.map((seat) => ({
          bookingId: newBooking.id,
          seatId: seat.id,
        })),
      });

      // --------------------------------------------------------
      // 7. Mark seats as BOOKED
      // --------------------------------------------------------

      await tx.seat.updateMany({
        where: {
          id: {
            in: seats.map((seat) => seat.id),
          },
        },
        data: {
          status: "BOOKED",
        },
      });

      // --------------------------------------------------------
      // 8. Return complete booking information
      // --------------------------------------------------------

      return tx.booking.findUnique({
        where: {
          id: newBooking.id,
        },
        include: {
          bookingSeats: {
            include: {
              seat: true,
            },
          },
          show: {
            include: {
              movie: true,
            },
          },
        },
      });
    });

    // ----------------------------------------------------------
    // 9. MongoDB audit log
    //
    // PostgreSQL remains the source of truth.
    // MongoDB stores the activity/audit history.
    // ----------------------------------------------------------

    try {
      await ActivityLog.create({
        userId,
        bookingId: booking.id,
        action: "BOOKING_CREATED",
        showId: booking.showId,
        movieTitle: booking.show.movie.title,
        seats: booking.bookingSeats.map(
          (bookingSeat) => bookingSeat.seat.seatNumber
        ),
      });
    } catch (logError) {
      /*
       * Do NOT fail a successful booking because an audit log
       * failed. PostgreSQL booking is the source of truth.
       */
      console.error(
        "⚠️ MongoDB booking audit log failed:",
        logError.message
      );
    }

    // ----------------------------------------------------------
    // 10. Send response
    // ----------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    // ----------------------------------------------------------
    // Seat not found
    // ----------------------------------------------------------

    if (error.message === "ONE_OR_MORE_SEATS_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "One or more requested seats were not found",
      });
    }

    // ----------------------------------------------------------
    // Seat already booked
    // ----------------------------------------------------------

    if (error.message.startsWith("SEATS_ALREADY_BOOKED:")) {
      const seats = error.message.split(":")[1];

      return res.status(409).json({
        success: false,
        message: `Seat(s) already booked: ${seats}`,
      });
    }

    // ----------------------------------------------------------
    // Prisma unique constraint
    // Additional safety net against duplicate booking-seat rows
    // ----------------------------------------------------------

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
      });
    }

    next(error);
  }
}

// ============================================================
// GET /api/bookings
// Get current user's bookings
// ============================================================

async function getMyBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        bookingSeats: {
          include: {
            seat: true,
          },
        },

        show: {
          include: {
            movie: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// GET /api/bookings/:id
// Get one booking belonging to current user
// ============================================================

async function getBookingById(req, res, next) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },

      include: {
        bookingSeats: {
          include: {
            seat: true,
          },
        },

        show: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// POST /api/bookings/:id/cancel
// Cancel booking and release seats
// ============================================================

async function cancelBooking(req, res, next) {
  try {
    // ----------------------------------------------------------
    // 1. PostgreSQL transaction
    // ----------------------------------------------------------

    const booking = await prisma.$transaction(async (tx) => {
      // --------------------------------------------------------
      // Find user's booking
      // --------------------------------------------------------

      const existingBooking = await tx.booking.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },

        include: {
          bookingSeats: true,
        },
      });

      if (!existingBooking) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      // --------------------------------------------------------
      // Prevent cancelling twice
      // --------------------------------------------------------

      if (existingBooking.status === "CANCELLED") {
        throw new Error("BOOKING_ALREADY_CANCELLED");
      }

      // --------------------------------------------------------
      // Get seat IDs
      // --------------------------------------------------------

      const seatIds = existingBooking.bookingSeats.map(
        (bookingSeat) => bookingSeat.seatId
      );

      // --------------------------------------------------------
      // Lock seats before releasing them
      // --------------------------------------------------------

      await tx.$queryRaw`
        SELECT id
        FROM seats
        WHERE id = ANY(${seatIds}::uuid[])
        FOR UPDATE
      `;

      // --------------------------------------------------------
      // Release seats
      // --------------------------------------------------------

      await tx.seat.updateMany({
        where: {
          id: {
            in: seatIds,
          },
        },

        data: {
          status: "AVAILABLE",
        },
      });

      // --------------------------------------------------------
      // Update booking status
      // --------------------------------------------------------

      return tx.booking.update({
        where: {
          id: existingBooking.id,
        },

        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },

        include: {
          bookingSeats: {
            include: {
              seat: true,
            },
          },

          show: {
            include: {
              movie: true,
            },
          },
        },
      });
    });

    // ----------------------------------------------------------
    // 2. MongoDB cancellation audit log
    // ----------------------------------------------------------

    try {
      await ActivityLog.create({
        userId: req.user.userId,
        bookingId: booking.id,
        action: "BOOKING_CANCELLED",
        showId: booking.showId,
        movieTitle: booking.show.movie.title,
        seats: booking.bookingSeats.map(
          (bookingSeat) => bookingSeat.seat.seatNumber
        ),
      });
    } catch (logError) {
      /*
       * Cancellation has already succeeded in PostgreSQL.
       * Do not reverse the cancellation because MongoDB logging
       * failed.
       */

      console.error(
        "⚠️ MongoDB cancellation audit log failed:",
        logError.message
      );
    }

    // ----------------------------------------------------------
    // 3. Send response
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Booking cancelled and seats released",
      data: {
        booking,
      },
    });
  } catch (error) {
    // ----------------------------------------------------------
    // Booking doesn't exist
    // ----------------------------------------------------------

    if (error.message === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ----------------------------------------------------------
    // Already cancelled
    // ----------------------------------------------------------

    if (error.message === "BOOKING_ALREADY_CANCELLED") {
      return res.status(409).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    next(error);
  }
}

// ============================================================
// Export controllers
// ============================================================

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};