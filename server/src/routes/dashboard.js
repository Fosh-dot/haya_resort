const express = require("express");

const { getDashboardStats } = require("../controllers/dashboardController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAdmin, getDashboardStats);

module.exports = router;
