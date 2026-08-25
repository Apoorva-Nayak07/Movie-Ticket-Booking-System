const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", createBooking);

router.get("/", getMyBookings);

router.get("/:id", getBookingById);

router.post("/:id/cancel", cancelBooking);

module.exports = router;