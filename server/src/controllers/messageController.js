const db = require("../config/db");
const { sendGuestReply } = require("../services/emailService");

/*
|--------------------------------------------------------------------------
| CREATE MESSAGE — PUBLIC
|--------------------------------------------------------------------------
*/
async function createMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO messages
      (
        name,
        email,
        phone,
        subject,
        message,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        subject?.trim() || null,
        message.trim(),
        "unread",
      ],
    );

    return res.status(201).json({
      message: "Your message has been sent successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      message: "Unable to send your message.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET MESSAGES — ADMIN
|--------------------------------------------------------------------------
*/
async function getMessages(req, res) {
  try {
    const [messages] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        admin_reply,
        replied_at,
        created_at,
        updated_at
      FROM messages
      ORDER BY created_at DESC
      `,
    );

    return res.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Unable to load messages.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET SINGLE MESSAGE — ADMIN
|--------------------------------------------------------------------------
*/
async function getMessageById(req, res) {
  try {
    const { id } = req.params;

    const [messages] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        admin_reply,
        replied_at,
        created_at,
        updated_at
      FROM messages
      WHERE id = ?
      LIMIT 1
      `,
      [id],
    );

    if (messages.length === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    return res.json({
      message: messages[0],
    });
  } catch (error) {
    console.error("Get message error:", error);

    return res.status(500).json({
      message: "Unable to load message.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| MARK MESSAGE AS READ — ADMIN
|--------------------------------------------------------------------------
*/
async function markMessageRead(req, res) {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE messages
      SET
        status = 'read',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    return res.json({
      message: "Message marked as read.",
    });
  } catch (error) {
    console.error("Mark message read error:", error);

    return res.status(500).json({
      message: "Unable to update message.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| REPLY TO MESSAGE — ADMIN
|--------------------------------------------------------------------------
*/
async function replyToMessage(req, res) {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(400).json({
        message: "Reply message is required.",
      });
    }

    const [messages] = await db.query(
      `
      SELECT id, email, name, subject
      FROM messages
      WHERE id = ?
      LIMIT 1
      `,
      [id],
    );

    if (messages.length === 0) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    const guest = messages[0];
    const cleanReply = reply.trim();

    if (!guest.email) {
      return res.status(400).json({
        message: "This guest does not have an email address.",
      });
    }

    // Send the email before marking the message as replied.
    let emailResult;

    try {
      emailResult = await sendGuestReply({
        to: guest.email,
        subject: guest.subject
          ? `Re: ${guest.subject}`
          : "Reply to your Haya Resort inquiry",
        message: cleanReply,
      });
    } catch (emailError) {
      console.error("Guest reply email failed:", emailError);

      return res.status(502).json({
        message:
          "The email could not be sent. Your message has not been marked as replied. Please check the email service configuration and try again.",
      });
    }

    // Only update the database after the email service accepts the email.
    await db.query(
      `
      UPDATE messages
      SET
        admin_reply = ?,
        status = 'replied',
        replied_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [cleanReply, id],
    );

    return res.json({
      message: "Reply accepted by the email service and saved successfully.",
      emailMessageId: emailResult.messageId || null,
    });
  } catch (error) {
    console.error("Reply to message error:", error);

    return res.status(500).json({
      message: "Unable to process your reply.",
    });
  }
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  markMessageRead,
  replyToMessage,
};
