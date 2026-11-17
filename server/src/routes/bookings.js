const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many booking attempts. Please try again later.",
  },
});

// Public booking submission
router.post("/", bookingLimiter, createBooking);

// Admin booking management
router.get("/", requireAdmin, getBookings);
router.get("/:id", requireAdmin, getBookingById);
router.patch("/:id/status", requireAdmin, updateBookingStatus);

module.exports = router;
