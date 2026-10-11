const nodemailer = require("nodemailer");
const dns = require("dns");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

function createEmailTransporter() {
  if (!emailUser || !emailPass) {
    throw new Error(
      "Email credentials are not configured. Check EMAIL_USER and EMAIL_PASS in your server .env file.",
    );
  }

  // Prefer IPv4 to avoid the unreachable IPv6 address in the error.
  dns.setDefaultResultOrder("ipv4first");

  return nodemailer.createTransport({
    service: "hotmail",

    auth: {
      user: emailUser,
      pass: emailPass,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,

    tls: {
      minVersion: "TLSv1.2",
    },
  });
}

async function sendGuestReply({ to, subject, message }) {
  if (!to || !subject || !message) {
    throw new Error("Recipient, subject and message are required.");
  }

  const transporter = createEmailTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"Haya Resort" <${emailUser}>`,
      to,
      subject,
      text: message,
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;line-height:1.7;max-width:650px;margin:auto">
          <div style="background:#303528;padding:24px;text-align:center">
            <h1 style="color:#d5bd82;margin:0;font-family:Georgia,serif">HAYA RESORT</h1>
            <p style="color:#ffffff;margin-bottom:0">Guest Relations</p>
          </div>

          <div style="padding:30px 24px">
            <p>Dear Guest,</p>
            <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
            <p>
              Thank you for contacting Haya Resort. If you have any further
              questions, please reply to this email.
            </p>
            <p>Warm regards,<br><strong>Haya Resort Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log("Guest reply email accepted by SMTP server:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return info;
  } catch (error) {
    console.error("Guest reply email failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });

    throw error;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = { sendGuestReply };
