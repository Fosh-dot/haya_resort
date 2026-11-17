const express = require("express");

const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public room access
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Admin-only room management
router.post("/", requireAdmin, createRoom);
router.patch("/:id", requireAdmin, updateRoom);
router.delete("/:id", requireAdmin, deleteRoom);

module.exports = router;
