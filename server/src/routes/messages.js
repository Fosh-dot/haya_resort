const express = require("express");

const {
  createMessage,
  getMessages,
  getMessageById,
  markMessageRead,
  replyToMessage,
} = require("../controllers/messageController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.post("/", createMessage);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get("/", requireAdmin, getMessages);

router.get("/:id", requireAdmin, getMessageById);

router.patch("/:id/read", requireAdmin, markMessageRead);

router.post("/:id/reply", requireAdmin, replyToMessage);

module.exports = router;
