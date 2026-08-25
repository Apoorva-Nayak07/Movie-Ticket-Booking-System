const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api", movieRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CineSync API is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;