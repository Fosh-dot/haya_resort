require("dotenv").config();

const express = require("express");
const cors = require("cors");

const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payments");
const settingsRoutes = require("./routes/settings");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const customerRoutes = require("./routes/customers");
const messageRoutes = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API HEALTH CHECK
// ===============================

// Main API status endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Haya Resort API is running",
  });
});

// Render health check endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    message: "Haya Resort API is responding",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/messages", messageRoutes);

// ===============================
// API 404 HANDLER
// ===============================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Haya Resort server running on port ${PORT}`);
});
