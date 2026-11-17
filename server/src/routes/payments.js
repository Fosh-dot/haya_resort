const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const { requireAdmin } = require("../middleware/authMiddleware");

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  getPaymentSlip,
} = require("../controllers/paymentController");

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many payment submissions. Please try again later.",
  },
});

const uploadDir = path.resolve(process.cwd(), "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .substring(0, 50);

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG, WEBP, and PDF files are allowed."),
      false,
    );
  }

  cb(null, true);
};

const uploadPaymentSlip = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Public payment submission
// Rate limiter runs before file upload.
router.post(
  "/",
  paymentLimiter,
  uploadPaymentSlip.single("paymentSlip"),
  createPayment,
);

// Admin payment management
router.get("/", requireAdmin, getPayments);
router.get("/:id/slip", requireAdmin, getPaymentSlip);
router.get("/:id", requireAdmin, getPaymentById);
router.patch("/:id/status", requireAdmin, updatePaymentStatus);

module.exports = router;
