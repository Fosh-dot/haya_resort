const express = require("express");

const {
  getPaymentSettings,
  updatePaymentSettings,
} = require("../controllers/settingsController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: guests need payment details to complete bookings.
router.get("/payment", getPaymentSettings);

// Admin only: updating payment details.
router.put("/payment", requireAdmin, updatePaymentSettings);

module.exports = router;
