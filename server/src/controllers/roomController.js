const db = require("../config/db");

/* =========================================================
   GET ALL ROOMS
========================================================= */

const getRooms = async (req, res) => {
  try {
    const [rooms] = await db.query(`
      SELECT
        id,
        name,
        slug,
        category,
        description,
        price_per_night,
        max_guests,
        bed_type,
        room_size,
        featured_image,
        is_available,
        created_at,
        updated_at
      FROM rooms
      ORDER BY id ASC
    `);

    res.json({
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    res.status(500).json({
      message: "Unable to fetch rooms.",
    });
  }
};

/* =========================================================
   GET SINGLE ROOM
========================================================= */

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rooms] = await db.query(
      `
      SELECT
        id,
        name,
        slug,
        category,
        description,
        price_per_night,
        max_guests,
        bed_type,
        room_size,
        featured_image,
        is_available,
        created_at,
        updated_at
      FROM rooms
      WHERE id = ?
      `,
      [id],
    );

    if (rooms.length === 0) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    res.json({
      room: rooms[0],
    });
  } catch (error) {
    console.error("Get room error:", error);

    res.status(500).json({
      message: "Unable to fetch room.",
    });
  }
};

/* =========================================================
   CREATE ROOM
========================================================= */

const createRoom = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      pricePerNight,
      maxGuests,
      bedType,
      roomSize,
      featuredImage,
      isAvailable,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Room name and slug are required.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO rooms
      (
        name,
        slug,
        category,
        description,
        price_per_night,
        max_guests,
        bed_type,
        room_size,
        featured_image,
        is_available
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        slug,
        category || null,
        description || null,
        pricePerNight || 0,
        maxGuests || 2,
        bedType || null,
        roomSize || null,
        featuredImage || null,
        isAvailable !== undefined ? isAvailable : 1,
      ],
    );

    const [rooms] = await db.query("SELECT * FROM rooms WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Room created successfully.",
      room: rooms[0],
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "Unable to create room.",
    });
  }
};

/* =========================================================
   UPDATE ROOM
========================================================= */

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      category,
      description,
      pricePerNight,
      maxGuests,
      bedType,
      roomSize,
      featuredImage,
      isAvailable,
    } = req.body;

    const [existingRooms] = await db.query("SELECT * FROM rooms WHERE id = ?", [
      id,
    ]);

    if (existingRooms.length === 0) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    const existing = existingRooms[0];

    await db.query(
      `
      UPDATE rooms
      SET
        name = ?,
        slug = ?,
        category = ?,
        description = ?,
        price_per_night = ?,
        max_guests = ?,
        bed_type = ?,
        room_size = ?,
        featured_image = ?,
        is_available = ?
      WHERE id = ?
      `,
      [
        name ?? existing.name,
        slug ?? existing.slug,
        category ?? existing.category,
        description ?? existing.description,
        pricePerNight ?? existing.price_per_night,
        maxGuests ?? existing.max_guests,
        bedType ?? existing.bed_type,
        roomSize ?? existing.room_size,
        featuredImage ?? existing.featured_image,
        isAvailable ?? existing.is_available,
        id,
      ],
    );

    const [rooms] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);

    res.json({
      message: "Room updated successfully.",
      room: rooms[0],
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      message: "Unable to update room.",
    });
  }
};

/* =========================================================
   DELETE ROOM
========================================================= */

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRooms] = await db.query("SELECT * FROM rooms WHERE id = ?", [
      id,
    ]);

    if (existingRooms.length === 0) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    await db.query("DELETE FROM rooms WHERE id = ?", [id]);

    res.json({
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    res.status(500).json({
      message: "Unable to delete room.",
    });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
