const db = require("../config/db");

// ========================================
// GET PAYMENT SETTINGS
// GET /api/settings/payment
// ========================================

const getPaymentSettings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT setting_key, setting_value
      FROM settings
      WHERE setting_key IN (
        'bank_name',
        'account_name',
        'account_number',
        'payment_instructions'
      )
    `);

    const settings = {
      bankName: "",
      accountName: "",
      accountNumber: "",
      paymentInstructions:
        "Please complete your bank transfer and upload your payment slip for verification.",
    };

    for (const row of rows) {
      switch (row.setting_key) {
        case "bank_name":
          settings.bankName = row.setting_value || "";
          break;

        case "account_name":
          settings.accountName = row.setting_value || "";
          break;

        case "account_number":
          settings.accountNumber = row.setting_value || "";
          break;

        case "payment_instructions":
          settings.paymentInstructions = row.setting_value || "";
          break;

        default:
          break;
      }
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get payment settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment settings.",
    });
  }
};

// ========================================
// UPDATE PAYMENT SETTINGS
// PUT /api/settings/payment
// ========================================

const updatePaymentSettings = async (req, res) => {
  try {
    const { bankName, accountName, accountNumber, paymentInstructions } =
      req.body;

    // Validate the submitted settings.
    if (
      typeof bankName !== "string" ||
      typeof accountName !== "string" ||
      typeof accountNumber !== "string" ||
      typeof paymentInstructions !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all payment settings as text.",
      });
    }

    const settingsToSave = [
      ["bank_name", bankName.trim()],
      ["account_name", accountName.trim()],
      ["account_number", accountNumber.trim()],
      ["payment_instructions", paymentInstructions.trim()],
    ];

    // Insert missing settings or update existing ones.
    for (const [key, value] of settingsToSave) {
      await db.query(
        `
          INSERT INTO settings (setting_key, setting_value)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE
            setting_value = VALUES(setting_value)
        `,
        [key, value],
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment settings saved successfully.",
      settings: {
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        paymentInstructions: paymentInstructions.trim(),
      },
    });
  } catch (error) {
    console.error("Update payment settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save payment settings.",
    });
  }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  getPaymentSettings,
  updatePaymentSettings,
};
