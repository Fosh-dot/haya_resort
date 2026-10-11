const db = require("../config/db");

async function getCustomers(req, res) {
  try {
    const [customers] = await db.query(`
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.created_at,
        c.updated_at,

        COUNT(DISTINCT b.id) AS booking_count,

        COALESCE(
          SUM(
            CASE
              WHEN p.status = 'verified'
              THEN p.amount
              ELSE 0
            END
          ),
          0
        ) AS total_paid

      FROM customers c

      LEFT JOIN bookings b
        ON c.id = b.customer_id

      LEFT JOIN payments p
        ON b.id = p.booking_id

      GROUP BY
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.created_at,
        c.updated_at

      ORDER BY c.created_at DESC
    `);

    return res.json({
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      message: "Unable to load customers.",
    });
  }
}

module.exports = {
  getCustomers,
};
