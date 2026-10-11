const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

/* =========================================================
   ADMIN LOGIN
========================================================= */

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    /* =====================================================
       FIND ADMIN
    ===================================================== */

    const [admins] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        is_active
      FROM admins
      WHERE email = ?
      LIMIT 1
      `,
      [email.trim().toLowerCase()],
    );

    if (admins.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const admin = admins[0];

    /* =====================================================
       CHECK ACCOUNT STATUS
    ===================================================== */

    if (!admin.is_active) {
      return res.status(403).json({
        message: "This admin account has been disabled.",
      });
    }

    /* =====================================================
       CHECK PASSWORD
    ===================================================== */

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* =====================================================
       CREATE JWT
    ===================================================== */

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    /* =====================================================
       UPDATE LAST LOGIN
    ===================================================== */

    await db.query(
      `
      UPDATE admins
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [admin.id],
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.json({
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
}

module.exports = {
  loginAdmin,
};
