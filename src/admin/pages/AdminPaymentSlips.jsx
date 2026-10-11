import { useEffect, useState } from "react";
import { getAdminToken } from "../services/adminAuth";

const API_URL = "https://haya-resort.onrender.com/api";

function AdminPaymentSlips() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [slipLoading, setSlipLoading] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch payment slips.");
      }

      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message || "Unable to fetch payment slips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const customerName =
      payment.customer_name ||
      `${payment.first_name || ""} ${payment.last_name || ""}`.trim();

    const searchText = [
      payment.payment_reference,
      payment.booking_reference,
      customerName,
      payment.email,
      payment.payment_method,
      payment.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const openSlip = async (payment) => {
    try {
      setSlipLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_URL}/payments/${payment.id}/slip`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Unable to open this payment slip.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // The server may return a non-JSON error.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      setSelectedSlip({
        url: fileUrl,
        type: blob.type,
        reference: payment.payment_reference || `Payment #${payment.id}`,
      });
    } catch (err) {
      setError(err.message || "Unable to open payment slip.");
    } finally {
      setSlipLoading(false);
    }
  };

  const closeSlip = () => {
    if (selectedSlip?.url) {
      URL.revokeObjectURL(selectedSlip.url);
    }

    setSelectedSlip(null);
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (status) => {
    const normalized = (status || "pending").toLowerCase();

    const styles = {
      pending: { background: "#fff4d6", color: "#946200" },
      under_review: { background: "#e8f1ff", color: "#2459a9" },
      verified: { background: "#e1f7e9", color: "#187443" },
      rejected: { background: "#ffe5e5", color: "#b42318" },
    };

    return (
      styles[normalized] || {
        background: "#f1f1f1",
        color: "#555",
      }
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>RESERVATION MANAGEMENT</p>
          <h1 style={styles.title}>Payment Slips</h1>
          <p style={styles.subtitle}>
            Review uploaded payment evidence submitted by guests.
          </p>
        </div>

        <button onClick={loadPayments} style={styles.refreshButton}>
          ↻ Refresh
        </button>
      </div>

      <div style={styles.summaryCard}>
        <div>
          <span style={styles.summaryLabel}>Total Payment Records</span>
          <strong style={styles.summaryValue}>{payments.length}</strong>
        </div>

        <div>
          <span style={styles.summaryLabel}>Awaiting Review</span>
          <strong style={styles.summaryValue}>
            {
              payments.filter((payment) =>
                ["pending", "under_review"].includes(
                  (payment.status || "").toLowerCase(),
                ),
              ).length
            }
          </strong>
        </div>

        <div>
          <span style={styles.summaryLabel}>Verified</span>
          <strong style={styles.summaryValue}>
            {
              payments.filter(
                (payment) =>
                  (payment.status || "").toLowerCase() === "verified",
              ).length
            }
          </strong>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          type="search"
          placeholder="Search guest, booking or payment reference..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={styles.searchInput}
        />

        <span style={styles.resultCount}>
          {filteredPayments.length} record
          {filteredPayments.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.message}>Loading payment slips...</div>
      ) : filteredPayments.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>▤</div>
          <h3>No payment slips found</h3>
          <p>
            {payments.length === 0
              ? "Uploaded payment records will appear here when available."
              : "Try searching with a different reference or guest name."}
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PAYMENT REFERENCE</th>
                <th style={styles.th}>BOOKING</th>
                <th style={styles.th}>GUEST</th>
                <th style={styles.th}>AMOUNT</th>
                <th style={styles.th}>DATE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => {
                const guestName =
                  payment.customer_name ||
                  `${payment.first_name || ""} ${
                    payment.last_name || ""
                  }`.trim() ||
                  "Guest";

                return (
                  <tr key={payment.id}>
                    <td style={styles.td}>
                      <strong>
                        {payment.payment_reference || `PAY-${payment.id}`}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {payment.booking_reference || "—"}
                    </td>

                    <td style={styles.td}>
                      <strong>{guestName}</strong>
                      {payment.email && (
                        <div style={styles.email}>{payment.email}</div>
                      )}
                    </td>

                    <td style={styles.td}>{formatAmount(payment.amount)}</td>

                    <td style={styles.td}>
                      {formatDate(payment.payment_date || payment.created_at)}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...statusStyle(payment.status),
                        }}
                      >
                        {(payment.status || "pending").replaceAll("_", " ")}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => openSlip(payment)}
                        disabled={slipLoading}
                        style={styles.viewButton}
                      >
                        View Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedSlip && (
        <div style={styles.modalOverlay} onClick={closeSlip}>
          <div
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Payment Evidence</h2>
                <p style={styles.subtitle}>{selectedSlip.reference}</p>
              </div>

              <button onClick={closeSlip} style={styles.closeButton}>
                ✕
              </button>
            </div>

            {selectedSlip.type === "application/pdf" ? (
              <iframe
                src={selectedSlip.url}
                title="Payment slip PDF"
                style={styles.preview}
              />
            ) : selectedSlip.type.startsWith("image/") ? (
              <img
                src={selectedSlip.url}
                alt="Uploaded payment slip"
                style={styles.imagePreview}
              />
            ) : (
              <div style={styles.message}>
                This file type cannot be previewed.
                <a
                  href={selectedSlip.url}
                  download="payment-slip"
                  style={styles.downloadLink}
                >
                  Download file
                </a>
              </div>
            )}

            <div style={styles.modalFooter}>
              <a
                href={selectedSlip.url}
                download="payment-slip"
                style={styles.downloadButton}
              >
                Download Slip
              </a>

              <button onClick={closeSlip} style={styles.closeModalButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "28px",
    color: "#252820",
    fontFamily: "inherit",
    minWidth: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "2px",
    color: "#9a7947",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  title: {
    fontSize: "30px",
    margin: "0 0 8px",
    fontWeight: 700,
  },
  subtitle: {
    color: "#777b73",
    fontSize: "13px",
    margin: 0,
  },
  refreshButton: {
    border: "1px solid #deded7",
    background: "#fff",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 600,
  },
  summaryCard: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
    padding: "24px",
    background: "#fff",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
    marginBottom: "24px",
  },
  summaryLabel: {
    display: "block",
    fontSize: "12px",
    color: "#777b73",
    marginBottom: "10px",
  },
  summaryValue: {
    fontSize: "27px",
    display: "block",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },
  searchInput: {
    width: "min(100%, 420px)",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #deded7",
    borderRadius: "7px",
    fontSize: "13px",
    outlineColor: "#9a7947",
  },
  resultCount: {
    color: "#777b73",
    fontSize: "12px",
  },
  error: {
    background: "#fff0f0",
    color: "#b42318",
    border: "1px solid #ffd4d4",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
  },
  message: {
    background: "#fff",
    padding: "32px",
    textAlign: "center",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
    color: "#777b73",
  },
  emptyState: {
    textAlign: "center",
    background: "#fff",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
    padding: "60px 20px",
    color: "#777b73",
  },
  emptyIcon: {
    fontSize: "35px",
    color: "#9a7947",
    marginBottom: "12px",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    background: "#fff",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "12px",
    minWidth: "850px",
  },
  th: {
    padding: "16px 14px",
    background: "#f8f8f5",
    color: "#777b73",
    fontSize: "10px",
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e9e9e3",
  },
  td: {
    padding: "17px 14px",
    borderBottom: "1px solid #eeeeea",
    verticalAlign: "middle",
  },
  email: {
    color: "#888",
    fontSize: "11px",
    marginTop: "5px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  viewButton: {
    background: "#293c30",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "9px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  modal: {
    width: "min(850px, 100%)",
    maxHeight: "90vh",
    overflow: "auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "22px",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px",
  },
  modalTitle: {
    margin: "0 0 6px",
    fontSize: "20px",
  },
  closeButton: {
    border: "none",
    background: "#f1f1ed",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer",
  },
  preview: {
    width: "100%",
    height: "65vh",
    border: "1px solid #eee",
  },
  imagePreview: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "65vh",
    objectFit: "contain",
    margin: "0 auto",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  downloadButton: {
    background: "#293c30",
    color: "#fff",
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  downloadLink: {
    display: "block",
    marginTop: "12px",
  },
  closeModalButton: {
    background: "#eee",
    border: "none",
    borderRadius: "6px",
    padding: "11px 16px",
    cursor: "pointer",
  },
};

export default AdminPaymentSlips;
