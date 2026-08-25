const { z } = require("zod");

const createBookingSchema = z.object({
  showId: z.string().uuid("Invalid show ID"),

  seatNumbers: z
    .array(
      z
        .string()
        .trim()
        .regex(/^A([1-9]|1[0-9]|20)$/, "Invalid seat number")
    )
    .min(1, "Select at least one seat")
    .max(20, "A maximum of 20 seats can be booked")
    .refine(
      (seats) => new Set(seats).size === seats.length,
      "Duplicate seat numbers are not allowed"
    ),
});

module.exports = {
  createBookingSchema,
};