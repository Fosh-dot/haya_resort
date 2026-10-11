const bcrypt = require("bcryptjs");
const db = require("../config/db");

async function createAdmin() {
  try {
    const name = "Haya Admin";
    const email = "admin@hayaresort.com";
    const password = "ChangeThisPassword123!";
    const role = "super_admin";

    const passwordHash = await bcrypt.hash(password, 12);

    const [existing] = await db.query(
      "SELECT id FROM admins WHERE email = ? LIMIT 1",
      [email],
    );

    if (existing.length > 0) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    await db.query(
      `
      INSERT INTO admins
      (
        name,
        email,
        password_hash,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, email, passwordHash, role, 1],
    );

    console.log("Admin created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Create admin error:", error);
    process.exit(1);
  }
}

createAdmin();
