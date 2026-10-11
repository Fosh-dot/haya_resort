const express = require("express");

const {
  getPaymentSettings,
  updatePaymentSettings,
} = require("../controllers/settingsController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public payment page reads payment settings.
router.get("/payment", getPaymentSettings);

// Only authenticated administrators can change payment settings.
router.put("/payment", requireAdmin, updatePaymentSettings);

module.exports = router;
