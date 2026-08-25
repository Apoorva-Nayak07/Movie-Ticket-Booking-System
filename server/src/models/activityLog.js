const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["BOOKING_CREATED", "BOOKING_CANCELLED"],
      required: true,
    },
    showId: {
      type: String,
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
  },
  {
    collection: "activity_logs",
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);