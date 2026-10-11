const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { requireAdmin } = require("../middleware/authMiddleware");

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  getPaymentSlip,
} = require("../controllers/paymentController");

const router = express.Router();

/* =========================================================
   PAYMENT SLIP UPLOAD
========================================================= */

const uploadDir = path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .substring(0, 50);

    const uniqueName = `${Date.now()}-${safeName}${extension}`;

    cb(null, uniqueName);
  },
});

/* =========================================================
   FILE VALIDATION
========================================================= */

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

/* =========================================================
   CUSTOMER PAYMENT SUBMISSION
   Public endpoint
========================================================= */

router.post("/", uploadPaymentSlip.single("paymentSlip"), createPayment);

/* =========================================================
   ADMIN PAYMENT MANAGEMENT
   Protected endpoints
========================================================= */

router.get("/", requireAdmin, getPayments);

router.get("/:id/slip", requireAdmin, getPaymentSlip);

router.get("/:id", requireAdmin, getPaymentById);

router.patch("/:id/status", requireAdmin, updatePaymentStatus);

module.exports = router;
