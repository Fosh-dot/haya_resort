const express = require("express");

const {
  getPaymentSettings,
  updatePaymentSettings,
} = require("../controllers/settingsController");

const router = express.Router();

// Retrieve payment settings.
router.get("/payment", getPaymentSettings);

// Save payment settings.
router.put("/payment", updatePaymentSettings);

module.exports = router;
