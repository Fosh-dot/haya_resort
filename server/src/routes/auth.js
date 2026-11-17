const express = require("express");
const rateLimit = require("express-rate-limit");

const { loginAdmin } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

router.post("/login", loginLimiter, loginAdmin);

router.get("/me", requireAdmin, (req, res) => {
  res.json({
    admin: req.admin,
  });
});

module.exports = router;
