import { useEffect, useMemo, useState } from "react";
import { getAdminToken } from "../services/adminAuth";
import "./AdminMessages.css";

const API_URL = "https://haya-resort.onrender.com/api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Load messages from the backend.
  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load messages.");
      }

      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  // Search and filter messages.
  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !term ||
        message.name?.toLowerCase().includes(term) ||
        message.email?.toLowerCase().includes(term) ||
        message.phone?.toLowerCase().includes(term) ||
        message.subject?.toLowerCase().includes(term) ||
        message.message?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || message.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  // Format message dates.
  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Open a message and mark it as read if necessary.
  async function openMessage(message) {
    setSelectedMessage(message);
    setReply(message.admin_reply || "");
    setError("");

    if (message.status === "unread") {
      try {
        const token = getAdminToken();

        const response = await fetch(`${API_URL}/messages/${message.id}/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to mark message as read.");
        }

        const updatedMessage = {
          ...message,
          status: "read",
        };

        setMessages((current) =>
          current.map((item) =>
            item.id === message.id ? updatedMessage : item,
          ),
        );

        setSelectedMessage(updatedMessage);
      } catch (err) {
        setError(err.message || "Unable to mark message as read.");
      }
    }
  }

  // Send a reply through the backend email integration.
  async function sendReply() {
    if (!selectedMessage) {
      setError("Please select a message first.");
      return;
    }

    if (!selectedMessage.email) {
      setError("This guest does not have an email address.");
      return;
    }

    if (!reply.trim()) {
      setError("Please enter a reply before sending.");
      return;
    }

    try {
      setSendingReply(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/messages/${selectedMessage.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reply: reply.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send the reply to this guest.",
        );
      }

      const updatedMessage = {
        ...selectedMessage,
        admin_reply: reply.trim(),
        status: "replied",
        replied_at: new Date().toISOString(),
      };

      // Update the dashboard immediately.
      setMessages((current) =>
        current.map((item) =>
          item.id === selectedMessage.id ? updatedMessage : item,
        ),
      );

      setSelectedMessage(updatedMessage);

      // Refresh from the database.
      await loadMessages();

      alert(
        data.message ||
          "Your reply was accepted by the email service and saved successfully.",
      );
    } catch (err) {
      setError(err.message || "Unable to send your reply.");
    } finally {
      setSendingReply(false);
    }
  }

  // Loading screen.
  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loader"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="admin-messages-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">GUEST COMMUNICATION</p>
          <h1>Messages</h1>
          <p>Read and manage inquiries sent through the resort website.</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadMessages}
          disabled={loading}
          type="button"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="admin-page-error" role="alert">
          {error}
        </div>
      )}

      {/* Message statistics */}
      <div className="messages-stats">
        <div>
          <span>Total messages</span>
          <strong>{messages.length}</strong>
        </div>

        <div>
          <span>Unread</span>
          <strong>
            {messages.filter((message) => message.status === "unread").length}
          </strong>
        </div>

        <div>
          <span>Replied</span>
          <strong>
            {messages.filter((message) => message.status === "replied").length}
          </strong>
        </div>
      </div>

      {/* Search and filter */}
      <div className="messages-toolbar">
        <div className="messages-search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search name, email or message..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search messages"
          />
        </div>

        <select
          aria-label="Filter messages by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="messages-summary">
        Showing <strong>{filteredMessages.length}</strong> of{" "}
        <strong>{messages.length}</strong> messages
      </div>

      {/* Messages table */}
      <div className="messages-table-card">
        {filteredMessages.length === 0 ? (
          <div className="messages-empty">
            <div className="messages-empty-icon">✉</div>
            <h3>No messages found</h3>
            <p>
              Messages submitted through the Contact Us form will appear here.
            </p>
          </div>
        ) : (
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <div className="message-sender">
                        <div className="message-avatar">
                          {(message.name || "G").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{message.name || "Guest"}</strong>
                          <span>{message.email || "—"}</span>
                          <span>{message.phone || "No phone"}</span>
                        </div>
                      </div>
                    </td>

                    <td>{message.subject || "Website inquiry"}</td>

                    <td>
                      <div className="message-preview">
                        {message.message || "No message content"}
                      </div>
                    </td>

                    <td>{formatDate(message.created_at)}</td>

                    <td>
                      <span
                        className={`message-status ${message.status || "unread"}`}
                      >
                        {(message.status || "unread").replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-message-button"
                        onClick={() => openMessage(message)}
                        type="button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message details and reply modal */}
      {selectedMessage && (
        <div
          className="message-modal-backdrop"
          onClick={() => setSelectedMessage(null)}
        >
          <section
            className="message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="message-modal-header">
              <div>
                <p>GUEST INQUIRY</p>

                <h2 id="message-modal-title">
                  {selectedMessage.subject || "Website inquiry"}
                </h2>
              </div>

              <button
                className="message-modal-close"
                aria-label="Close message"
                onClick={() => setSelectedMessage(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="message-modal-content">
              <div className="message-contact-details">
                <div>
                  <span>Full name</span>
                  <strong>{selectedMessage.name || "—"}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedMessage.email || "—"}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedMessage.phone || "—"}</strong>
                </div>

                <div>
                  <span>Received</span>
                  <strong>{formatDate(selectedMessage.created_at)}</strong>
                </div>
              </div>

              <div className="message-original">
                <label>ORIGINAL MESSAGE</label>
                <p>{selectedMessage.message}</p>
              </div>

              {selectedMessage.admin_reply && (
                <div className="message-saved-reply">
                  <label>PREVIOUS REPLY</label>
                  <p>{selectedMessage.admin_reply}</p>
                </div>
              )}

              <div className="message-reply">
                <label htmlFor="admin-message-reply">YOUR REPLY</label>

                <textarea
                  id="admin-message-reply"
                  rows="5"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a response to this inquiry..."
                  disabled={sendingReply}
                />

                <p className="message-reply-note">
                  Your response will be emailed to the guest and recorded in the
                  dashboard when the backend email service is configured and the
                  email provider accepts the message.
                </p>
              </div>
            </div>

            <div className="message-modal-actions">
              <button
                className="message-close-action"
                onClick={() => setSelectedMessage(null)}
                type="button"
                disabled={sendingReply}
              >
                Close
              </button>

              <button
                className="message-reply-action"
                onClick={sendReply}
                disabled={sendingReply || !reply.trim()}
                type="button"
              >
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
