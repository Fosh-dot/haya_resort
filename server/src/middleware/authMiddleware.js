const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [admins] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        is_active
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id],
    );

    if (admins.length === 0) {
      return res.status(401).json({
        message: "Admin account not found.",
      });
    }

    const admin = admins[0];

    if (!admin.is_active) {
      return res.status(403).json({
        message: "Admin account has been disabled.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(500).json({
      message: "Unable to authenticate admin.",
    });
  }
}

module.exports = {
  requireAdmin,
};
