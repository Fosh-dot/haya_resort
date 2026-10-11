const express = require("express");

const { loginAdmin } = require("../controllers/authController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", requireAdmin, (req, res) => {
  res.json({
    admin: req.admin,
  });
});

module.exports = router;
