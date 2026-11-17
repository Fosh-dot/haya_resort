const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// JWT security validation
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be configured and contain at least 32 characters.",
  );
}

const roomsRoutes = require("./routes/rooms");
const bookingsRoutes = require("./routes/bookings");
const paymentsRoutes = require("./routes/payments");
const settingsRoutes = require("./routes/settings");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const customersRoutes = require("./routes/customers");
const messagesRoutes = require("./routes/messages");

const app = express();

// Trust the aaPanel/Nginx reverse proxy in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet());

// Allowed frontend domains
const allowedOrigins = ["https://www.hayaresort.org", "https://hayaresort.org"];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request body limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Haya Resort API is running.",
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});

// API routes
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/messages", messagesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("API Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred."
        : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Haya Resort server running on port ${PORT}`);
});

module.exports = app;
