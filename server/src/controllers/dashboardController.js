const db = require("../config/db");

async function getDashboardStats(req, res) {
  try {
    const [
      [bookingStats],
      [paymentStats],
      [customerStats],
      [revenueStats],
      [recentBookings],
      [recentPayments],
    ] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*) AS totalBookings,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingBookings,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmedBookings,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledBookings
        FROM bookings
      `),

      db.query(`
        SELECT
          COUNT(*) AS totalPayments,
          SUM(CASE
            WHEN status IN ('pending', 'under_review')
            THEN 1 ELSE 0
          END) AS pendingPayments,
          SUM(CASE
            WHEN status = 'verified'
            THEN 1 ELSE 0
          END) AS verifiedPayments
        FROM payments
      `),

      db.query(`
        SELECT COUNT(*) AS totalCustomers
        FROM customers
      `),

      db.query(`
        SELECT
          COALESCE(SUM(
            CASE
              WHEN status = 'verified' THEN amount
              ELSE 0
            END
          ), 0) AS revenue
        FROM payments
      `),

      db.query(`
        SELECT
          b.id,
          b.booking_reference,
          b.check_in,
          b.check_out,
          b.guests,
          b.nights,
          b.total_amount,
          b.status,
          b.created_at,
          CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
          c.email AS customer_email,
          r.name AS room_name
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.id
        LEFT JOIN rooms r ON b.room_id = r.id
        ORDER BY b.created_at DESC
        LIMIT 8
      `),

      db.query(`
        SELECT
          p.id,
          p.amount,
          p.payment_reference,
          p.payment_date,
          p.payment_method,
          p.status,
          p.created_at,
          b.booking_reference,
          CONCAT(c.first_name, ' ', c.last_name) AS customer_name
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        LEFT JOIN customers c ON b.customer_id = c.id
        ORDER BY p.created_at DESC
        LIMIT 8
      `),
    ]);

    return res.json({
      stats: {
        totalBookings: Number(bookingStats[0]?.totalBookings || 0),
        pendingBookings: Number(bookingStats[0]?.pendingBookings || 0),
        confirmedBookings: Number(bookingStats[0]?.confirmedBookings || 0),
        cancelledBookings: Number(bookingStats[0]?.cancelledBookings || 0),

        totalPayments: Number(paymentStats[0]?.totalPayments || 0),
        pendingPayments: Number(paymentStats[0]?.pendingPayments || 0),
        verifiedPayments: Number(paymentStats[0]?.verifiedPayments || 0),

        totalCustomers: Number(customerStats[0]?.totalCustomers || 0),

        revenue: Number(revenueStats[0]?.revenue || 0),
      },

      recentBookings,
      recentPayments,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      message: "Unable to load dashboard statistics.",
    });
  }
}

module.exports = {
  getDashboardStats,
};
