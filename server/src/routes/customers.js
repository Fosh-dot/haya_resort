const express = require("express");

const { getCustomers } = require("../controllers/customerController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAdmin, getCustomers);

module.exports = router;
