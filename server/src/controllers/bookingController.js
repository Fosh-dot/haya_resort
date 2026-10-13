const db = require("../config/db");

const ALLOWED_BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "completed",
];

/* =========================================================
   HELPER: NORMALIZE ROOM IDS
========================================================= */
function normalizeRoomIds(body) {
  let incoming = [];

  if (Array.isArray(body.roomIds)) {
    incoming = body.roomIds;
  } else if (Array.isArray(body.rooms)) {
    incoming = body.rooms.map((room) =>
      typeof room === "object" && room !== null
        ? (room.id ?? room.room_id)
        : room,
    );
  } else if (body.roomId !== undefined) {
    incoming = [body.roomId];
  }

  const ids = incoming.map(Number);

  if (ids.length === 0 || ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    return null;
  }

  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length !== ids.length) {
    return null;
  }

  return uniqueIds;
}

/* =========================================================
   HELPER: VALIDATE DATE
========================================================= */
function validDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/* =========================================================
   HELPER: CALCULATE NIGHTS
========================================================= */
function nightsBetween(checkIn, checkOut) {
  return Math.round(
    (new Date(`${checkOut}T00:00:00Z`) - new Date(`${checkIn}T00:00:00Z`)) /
      (1000 * 60 * 60 * 24),
  );
}

/* =========================================================
   HELPER: GENERATE BOOKING REFERENCE
========================================================= */
function makeBookingReference() {
  return `HAYA-${Date.now().toString().slice(-8)}-${Math.floor(
    100 + Math.random() * 900,
  )}`;
}

/* =========================================================
   CREATE BOOKING — PUBLIC

   Accepts:
   roomIds: [1, 2]
   rooms: [{ id: 1 }, { id: 2 }]
   Legacy: roomId: 1

   Prices come from the database.
   Overlapping bookings are permitted.
========================================================= */
async function createBooking(req, res) {
  let connection;
  let transactionStarted = false;

  try {
    const {
      checkIn,
      checkOut,
      guests = 1,
      firstName,
      lastName,
      email,
      phone,
      specialRequest,
      specialRequests,
    } = req.body;

    const roomIds = normalizeRoomIds(req.body);
    const guestCount = Number(guests);

    /* VALIDATE REQUIRED FIELDS */
    if (
      !roomIds ||
      !validDateString(checkIn) ||
      !validDateString(checkOut) ||
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        message:
          "Please provide valid room selections, dates, guest count, first name, last name, email, and phone.",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date.",
      });
    }

    const nights = nightsBetween(checkIn, checkOut);

    if (nights < 1) {
      return res.status(400).json({
        message: "The selected stay must be at least one night.",
      });
    }

    /* START DATABASE TRANSACTION */
    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    /* FETCH SELECTED ROOMS */
    const placeholders = roomIds.map(() => "?").join(", ");

    const [roomRows] = await connection.query(
      `
      SELECT
        id,
        name,
        price_per_night,
        max_guests,
        is_available
      FROM rooms
      WHERE id IN (${placeholders})
      ORDER BY id
      FOR UPDATE
      `,
      roomIds,
    );

    if (roomRows.length !== roomIds.length) {
      await connection.rollback();
      transactionStarted = false;

      return res.status(404).json({
        message: "One or more selected rooms were not found.",
      });
    }

    const roomById = new Map(roomRows.map((room) => [Number(room.id), room]));

    const selectedRooms = roomIds.map((id) => roomById.get(id));

    /* CHECK ROOM AVAILABILITY AND CAPACITY */
    for (const room of selectedRooms) {
      if (!Number(room.is_available)) {
        await connection.rollback();
        transactionStarted = false;

        return res.status(400).json({
          message: `${room.name} is currently unavailable.`,
        });
      }

      if (guestCount > Number(room.max_guests)) {
        await connection.rollback();
        transactionStarted = false;

        return res.status(400).json({
          message: `${room.name} allows a maximum of ${room.max_guests} guests.`,
        });
      }
    }

    /*
      DATE-CONFLICT CHECKS REMOVED.

      Multiple customers may book the same room for overlapping
      dates. Each booking is saved as a separate database record.

      Room availability and guest-capacity validation remain active.
    */

    /* FIND EXISTING CUSTOMER */
    const normalizedEmail = email.trim().toLowerCase();

    const [existingCustomers] = await connection.query(
      `
      SELECT id
      FROM customers
      WHERE email = ?
      LIMIT 1
      FOR UPDATE
      `,
      [normalizedEmail],
    );

    let customerId;

    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;

      await connection.query(
        `
        UPDATE customers
        SET
          first_name = ?,
          last_name = ?,
          phone = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [firstName.trim(), lastName.trim(), phone.trim(), customerId],
      );
    } else {
      const [customerResult] = await connection.query(
        `
        INSERT INTO customers (
          first_name,
          last_name,
          email,
          phone
        )
        VALUES (?, ?, ?, ?)
        `,
        [firstName.trim(), lastName.trim(), normalizedEmail, phone.trim()],
      );

      customerId = customerResult.insertId;
    }

    /* CALCULATE TOTAL USING DATABASE PRICES */
    const roomPriceTotal = selectedRooms.reduce(
      (sum, room) => sum + Number(room.price_per_night || 0),
      0,
    );

    const totalAmount = Number((roomPriceTotal * nights).toFixed(2));

    const bookingReference = makeBookingReference();

    /* KEEP PRIMARY ROOM FOR EXISTING ADMIN COMPATIBILITY */
    const primaryRoom = selectedRooms[0];

    /* CREATE MAIN BOOKING */
    const [bookingResult] = await connection.query(
      `
      INSERT INTO bookings (
        booking_reference,
        customer_id,
        room_id,
        check_in,
        check_out,
        guests,
        special_request,
        nights,
        room_price,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `,
      [
        bookingReference,
        customerId,
        primaryRoom.id,
        checkIn,
        checkOut,
        guestCount,
        (typeof specialRequest === "string"
          ? specialRequest
          : specialRequests) || null,
        nights,
        roomPriceTotal,
        totalAmount,
      ],
    );

    const bookingId = bookingResult.insertId;

    /* LINK ALL SELECTED ROOMS TO THIS BOOKING */
    for (const room of selectedRooms) {
      await connection.query(
        `
        INSERT INTO booking_rooms (
          booking_id,
          room_id,
          room_price
        )
        VALUES (?, ?, ?)
        `,
        [bookingId, room.id, Number(room.price_per_night || 0)],
      );
    }

    /* SAVE TRANSACTION */
    await connection.commit();
    transactionStarted = false;

    /* RETURN CREATED BOOKING */
    return res.status(201).json({
      message: "Booking created successfully.",

      booking: {
        id: bookingId,
        booking_reference: bookingReference,
        customer_id: customerId,

        room_id: primaryRoom.id,
        room_name: primaryRoom.name,

        rooms: selectedRooms.map((room) => ({
          id: room.id,
          name: room.name,
          price_per_night: Number(room.price_per_night || 0),
        })),

        check_in: checkIn,
        check_out: checkOut,
        guests: guestCount,

        special_request:
          (typeof specialRequest === "string"
            ? specialRequest
            : specialRequests) || "",

        nights,
        room_price: roomPriceTotal,
        total_amount: totalAmount,
        status: "pending",
      },
    });
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Booking rollback error:", rollbackError);
      }
    }

    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Unable to create booking.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/* =========================================================
   GET ALL BOOKINGS — ADMIN
========================================================= */
async function getBookings(req, res) {
  try {
    const [bookings] = await db.query(`
      SELECT
        b.id,
        b.booking_reference,
        b.check_in,
        b.check_out,
        b.guests,
        b.special_request,
        b.nights,
        b.room_price,
        b.total_amount,
        b.status,
        b.created_at,
        b.updated_at,

        c.id AS customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,

        r.id AS room_id,
        r.name AS room_name,
        r.category AS room_category,

        room_summary.room_ids,
        room_summary.room_names

      FROM bookings b

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      LEFT JOIN (
        SELECT
          br.booking_id,

          GROUP_CONCAT(
            DISTINCT br.room_id
            ORDER BY br.room_id
          ) AS room_ids,

          GROUP_CONCAT(
            DISTINCT r2.name
            ORDER BY r2.name
            SEPARATOR ', '
          ) AS room_names

        FROM booking_rooms br

        LEFT JOIN rooms r2
          ON r2.id = br.room_id

        GROUP BY br.booking_id
      ) AS room_summary
        ON room_summary.booking_id = b.id

      ORDER BY b.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
}

/* =========================================================
   GET SINGLE BOOKING — ADMIN
========================================================= */
async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const [bookings] = await db.query(
      `
      SELECT
        b.id,
        b.booking_reference,
        b.check_in,
        b.check_out,
        b.guests,
        b.special_request,
        b.nights,
        b.room_price,
        b.total_amount,
        b.status,
        b.created_at,
        b.updated_at,

        c.id AS customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,

        r.id AS room_id,
        r.name AS room_name,
        r.category AS room_category,
        r.bed_type,
        r.room_size

      FROM bookings b

      LEFT JOIN customers c
        ON b.customer_id = c.id

      LEFT JOIN rooms r
        ON b.room_id = r.id

      WHERE b.id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const [rooms] = await db.query(
      `
      SELECT
        br.room_id AS id,
        r.name,
        r.category,
        r.bed_type,
        r.room_size,
        br.room_price AS price_per_night

      FROM booking_rooms br

      INNER JOIN rooms r
        ON r.id = br.room_id

      WHERE br.booking_id = ?
      ORDER BY br.id
      `,
      [Number(id)],
    );

    return res.json({
      booking: {
        ...bookings[0],
        rooms,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      message: "Unable to load booking.",
    });
  }
}

/* =========================================================
   UPDATE BOOKING STATUS — ADMIN
========================================================= */
async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    if (!ALLOWED_BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status.",
      });
    }

    const [result] = await db.query(
      `
      UPDATE bookings
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [status, Number(id)],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const [bookings] = await db.query(
      `
      SELECT
        id,
        booking_reference,
        status,
        updated_at
      FROM bookings
      WHERE id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    return res.json({
      message: "Booking status updated successfully.",
      booking: bookings[0],
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      message: "Unable to update booking status.",
    });
  }
}

/* =========================================================
   EXPORT CONTROLLER FUNCTIONS
========================================================= */
module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
