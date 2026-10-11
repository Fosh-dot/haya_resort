const express = require("express");

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public booking
|--------------------------------------------------------------------------
*/

router.post("/", createBooking);

/*
|--------------------------------------------------------------------------
| Admin booking management
|--------------------------------------------------------------------------
*/

router.get("/", requireAdmin, getBookings);

router.get("/:id", requireAdmin, getBookingById);

router.patch("/:id/status", requireAdmin, updateBookingStatus);

module.exports = router;
