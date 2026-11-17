const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createMessage,
  getMessages,
  getMessageById,
  markMessageRead,
  replyToMessage,
} = require("../controllers/messageController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many messages submitted. Please try again later.",
  },
});

// Public contact form
router.post("/", messageLimiter, createMessage);

// Admin message management
router.get("/", requireAdmin, getMessages);
router.get("/:id", requireAdmin, getMessageById);
router.patch("/:id/read", requireAdmin, markMessageRead);
router.post("/:id/reply", requireAdmin, replyToMessage);

module.exports = router;
