const db = require("../config/db");
const path = require("path");
const fs = require("fs");

/* =========================================================
   CREATE PAYMENT — PUBLIC
========================================================= */
async function createPayment(req, res) {
  try {
    const { bookingId, amount, paymentReference, paymentDate, paymentMethod } =
      req.body;

    if (!bookingId || !Number.isInteger(Number(bookingId))) {
      return res.status(400).json({
        message: "A valid booking ID is required.",
      });
    }

    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "A valid payment amount is required.",
      });
    }

    if (typeof paymentReference !== "string" || !paymentReference.trim()) {
      return res.status(400).json({
        message: "Payment reference is required.",
      });
    }

    if (!paymentDate || Number.isNaN(Date.parse(paymentDate))) {
      return res.status(400).json({
        message: "A valid payment date is required.",
      });
    }

    if (typeof paymentMethod !== "string" || !paymentMethod.trim()) {
      return res.status(400).json({
        message: "Payment method is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Payment slip is required.",
      });
    }

    const [bookings] = await db.query(
      `
      SELECT
        id,
        booking_reference,
        total_amount,
        status
      FROM bookings
      WHERE id = ?
      LIMIT 1
      `,
      [Number(bookingId)],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const booking = bookings[0];

    if (["cancelled", "rejected"].includes(booking.status)) {
      return res.status(400).json({
        message: "Payment cannot be submitted for this booking.",
      });
    }

    /*
      Prevent another active payment submission.
      A rejected payment can be resubmitted.
    */
    const [existingPayments] = await db.query(
      `
      SELECT id
      FROM payments
      WHERE booking_id = ?
        AND status IN ('pending', 'under_review', 'verified')
      LIMIT 1
      `,
      [Number(bookingId)],
    );

    if (existingPayments.length > 0) {
      return res.status(409).json({
        message: "A payment has already been submitted for this booking.",
      });
    }

    /*
      IMPORTANT:
      This uses the existing payments table and the upload
      directory configured by your Multer middleware.
    */
    const paymentSlip = `/uploads/${req.file.filename}`;

    const [result] = await db.query(
      `
      INSERT INTO payments (
        booking_id,
        amount,
        payment_reference,
        payment_slip,
        payment_date,
        payment_method,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(bookingId),
        Number(amount),
        paymentReference.trim(),
        paymentSlip,
        paymentDate,
        paymentMethod.trim(),
        "pending",
      ],
    );

    const [payments] = await db.query(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_reference,
        p.payment_slip,
        p.payment_date,
        p.payment_method,
        p.status,
        p.created_at,
        p.updated_at
      FROM payments p
      WHERE p.id = ?
      LIMIT 1
      `,
      [result.insertId],
    );

    return res.status(201).json({
      message: "Payment submitted successfully.",
      payment: payments[0],
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      message: "Unable to submit payment.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/* =========================================================
   GET PAYMENTS — ADMIN
========================================================= */
async function getPayments(req, res) {
  try {
    const [payments] = await db.query(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_reference,
        p.payment_slip,
        p.payment_date,
        p.payment_method,
        p.status,
        p.verified_by,
        p.verified_at,
        p.notes,
        p.created_at,
        p.updated_at,

        b.booking_reference,

        c.id AS customer_id,
        c.first_name,
        c.last_name,
        CONCAT_WS(' ', c.first_name, c.last_name) AS customer_name,
        c.email,
        c.phone,

        r.name AS room_name

      FROM payments p

      LEFT JOIN bookings b
        ON b.id = p.booking_id

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      ORDER BY p.created_at DESC
      `,
    );

    return res.json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);

    return res.status(500).json({
      message: "Unable to fetch payments.",
    });
  }
}

/* =========================================================
   GET PAYMENT BY ID — ADMIN
========================================================= */
async function getPaymentById(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID.",
      });
    }

    const [payments] = await db.query(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_reference,
        p.payment_slip,
        p.payment_date,
        p.payment_method,
        p.status,
        p.verified_by,
        p.verified_at,
        p.notes,
        p.created_at,
        p.updated_at,

        b.booking_reference,

        c.id AS customer_id,
        c.first_name,
        c.last_name,
        CONCAT_WS(' ', c.first_name, c.last_name) AS customer_name,
        c.email,
        c.phone,

        r.name AS room_name

      FROM payments p

      LEFT JOIN bookings b
        ON b.id = p.booking_id

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      WHERE p.id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    if (payments.length === 0) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    return res.json({
      payment: payments[0],
    });
  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      message: "Unable to fetch payment.",
    });
  }
}

/* =========================================================
   UPDATE PAYMENT STATUS — ADMIN
========================================================= */
async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, verifiedBy, notes } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID.",
      });
    }

    const allowedStatuses = ["pending", "under_review", "verified", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid payment status.",
      });
    }

    const [existingPayments] = await db.query(
      `
      SELECT id, status
      FROM payments
      WHERE id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    if (existingPayments.length === 0) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    const verifiedAt = status === "verified" ? new Date() : null;

    const [result] = await db.query(
      `
      UPDATE payments
      SET
        status = ?,
        verified_by = ?,
        verified_at = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        status,
        status === "verified" ? verifiedBy || "Admin" : null,
        verifiedAt,
        typeof notes === "string" ? notes.trim() || null : null,
        Number(id),
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    const [payments] = await db.query(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_reference,
        p.payment_slip,
        p.payment_date,
        p.payment_method,
        p.status,
        p.verified_by,
        p.verified_at,
        p.notes,
        p.created_at,
        p.updated_at,

        b.booking_reference,

        c.id AS customer_id,
        c.first_name,
        c.last_name,
        CONCAT_WS(' ', c.first_name, c.last_name) AS customer_name,
        c.email,
        c.phone,

        r.name AS room_name

      FROM payments p

      LEFT JOIN bookings b
        ON b.id = p.booking_id

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      WHERE p.id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    return res.json({
      message: "Payment status updated successfully.",
      payment: payments[0],
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    return res.status(500).json({
      message: "Unable to update payment status.",
    });
  }
}

/* =========================================================
   GET PAYMENT SLIP — ADMIN
========================================================= */
async function getPaymentSlip(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID.",
      });
    }

    const [payments] = await db.query(
      `
      SELECT payment_slip
      FROM payments
      WHERE id = ?
      LIMIT 1
      `,
      [Number(id)],
    );

    if (payments.length === 0) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    const paymentSlip = payments[0].payment_slip;

    if (!paymentSlip) {
      return res.status(404).json({
        message: "No payment slip was uploaded.",
      });
    }

    const fileName = path.basename(paymentSlip);
    const uploadDirectory = path.resolve(__dirname, "../../uploads");
    const filePath = path.join(uploadDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "The payment slip file could not be found on the server.",
      });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Get payment slip error:", error);

    return res.status(500).json({
      message: "Unable to open payment slip.",
    });
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  getPaymentSlip,
};
