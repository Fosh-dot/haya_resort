import { useEffect, useMemo, useState } from "react";
import { getAdminToken } from "../services/adminAuth";
import "./AdminPayments.css";

const API_URL = "http://localhost:5000/api";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [slipUrl, setSlipUrl] = useState("");
  const [slipLoading, setSlipLoading] = useState(false);
  const [slipError, setSlipError] = useState("");
  const [slipIsPdf, setSlipIsPdf] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState("");

  function getCustomerName(payment) {
    return (
      payment.customer_name ||
      [payment.first_name, payment.last_name].filter(Boolean).join(" ") ||
      "Guest"
    );
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-PH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("en-PH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatAmount(amount) {
    return `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load payments.");
      }

      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      setError(err.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    return () => {
      if (slipUrl) {
        URL.revokeObjectURL(slipUrl);
      }
    };
  }, [slipUrl]);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const customerName = getCustomerName(payment).toLowerCase();

      const matchesSearch =
        !term ||
        String(payment.payment_reference || "")
          .toLowerCase()
          .includes(term) ||
        String(payment.booking_reference || "")
          .toLowerCase()
          .includes(term) ||
        customerName.includes(term) ||
        String(payment.email || "")
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  async function openPayment(payment) {
    setSelectedPayment(payment);
    setNotes(payment.notes || "");
    setSlipError("");
    setSlipIsPdf(false);

    if (slipUrl) {
      URL.revokeObjectURL(slipUrl);
      setSlipUrl("");
    }

    if (!payment.payment_slip) {
      return;
    }

    try {
      setSlipLoading(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/payments/${payment.id}/slip`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to load payment slip.");
      }

      const blob = await response.blob();

      const isPdf =
        blob.type === "application/pdf" ||
        String(payment.payment_slip).toLowerCase().endsWith(".pdf");

      setSlipIsPdf(isPdf);
      setSlipUrl(URL.createObjectURL(blob));
    } catch (err) {
      setSlipError(err.message || "Unable to load payment slip.");
    } finally {
      setSlipLoading(false);
    }
  }

  function closePayment() {
    if (slipUrl) {
      URL.revokeObjectURL(slipUrl);
    }

    setSlipUrl("");
    setSlipError("");
    setSlipIsPdf(false);
    setSelectedPayment(null);
    setNotes("");
  }

  async function updatePaymentStatus(id, status) {
    try {
      setUpdatingId(id);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/payments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          verifiedBy: status === "verified" ? "Admin" : null,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update payment.");
      }

      const updatedPayment = {
        ...selectedPayment,
        status: data.payment?.status || data.status || status,
        notes: notes.trim(),
      };

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                status: updatedPayment.status,
                notes: updatedPayment.notes,
              }
            : payment,
        ),
      );

      setSelectedPayment((currentPayment) =>
        currentPayment?.id === id ? updatedPayment : currentPayment,
      );

      alert(
        status === "verified"
          ? "Payment verified successfully."
          : status === "rejected"
            ? "Payment rejected successfully."
            : "Payment status updated successfully.",
      );

      await loadPayments();
    } catch (err) {
      alert(err.message || "Unable to update payment.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loader"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">FINANCE</p>
          <h1>Payments</h1>
          <p>Review guest payments and verify submitted payment slips.</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadPayments}
          disabled={loading}
          type="button"
        >
          ↻ Refresh
        </button>
      </div>

      {error && <div className="admin-page-error">{error}</div>}

      <div className="payment-toolbar">
        <div className="payment-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search payment, booking or guest..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="payment-summary">
        Showing <strong>{filteredPayments.length}</strong> of{" "}
        <strong>{payments.length}</strong> payments
      </div>

      <div className="payments-table-card">
        {filteredPayments.length === 0 ? (
          <div className="payments-empty">
            <div className="payments-empty-icon">₱</div>
            <h3>No payments found</h3>
            <p>
              {payments.length === 0
                ? "Submitted payments will appear here."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Guest</th>
                  <th>Booking</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const customerName = getCustomerName(payment);

                  return (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.payment_reference || "—"}</strong>

                        <span className="payment-created">
                          Submitted {formatDate(payment.created_at)}
                        </span>
                      </td>

                      <td>
                        <div className="payment-guest">
                          <div className="payment-avatar">
                            {customerName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{customerName}</strong>
                            <span>{payment.email || "—"}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>{payment.booking_reference || "—"}</strong>
                      </td>

                      <td>
                        <strong>{formatAmount(payment.amount)}</strong>
                      </td>

                      <td>{formatDate(payment.payment_date)}</td>

                      <td>
                        <span className="payment-method">
                          {payment.payment_method?.replaceAll("_", " ") || "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`payment-status ${payment.status || "pending"}`}
                        >
                          {(payment.status || "pending").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td>
                        <button
                          className="view-payment-button"
                          onClick={() => openPayment(payment)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPayment && (
        <div className="payment-modal-backdrop" onClick={closePayment}>
          <div
            className="payment-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <p>PAYMENT REVIEW</p>
                <h2>{selectedPayment.payment_reference || "Payment"}</h2>
              </div>

              <button
                className="payment-modal-close"
                onClick={closePayment}
                aria-label="Close payment review"
              >
                ×
              </button>
            </div>

            <div className="payment-modal-content">
              <div className="payment-review-layout">
                <div className="payment-slip-section">
                  <div className="payment-section-title">
                    <span>PAYMENT SLIP</span>
                  </div>

                  {slipLoading ? (
                    <div className="slip-loading">Loading slip...</div>
                  ) : slipError ? (
                    <div className="no-slip">{slipError}</div>
                  ) : slipUrl ? (
                    <div className="slip-preview">
                      {slipIsPdf ? (
                        <iframe
                          src={slipUrl}
                          title="Payment slip"
                          style={{
                            width: "100%",
                            minHeight: "450px",
                            border: "none",
                          }}
                        />
                      ) : (
                        <img
                          src={slipUrl}
                          alt="Guest payment slip"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="no-slip">
                      No payment slip available for this payment.
                    </div>
                  )}
                </div>

                <div className="payment-information">
                  <div className="payment-detail">
                    <span>Guest</span>
                    <strong>{getCustomerName(selectedPayment)}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Email</span>
                    <strong>{selectedPayment.email || "—"}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Booking</span>
                    <strong>{selectedPayment.booking_reference || "—"}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Room</span>
                    <strong>{selectedPayment.room_name || "—"}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Amount</span>
                    <strong className="payment-total">
                      {formatAmount(selectedPayment.amount)}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Payment Date</span>
                    <strong>{formatDate(selectedPayment.payment_date)}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Submitted</span>
                    <strong>
                      {formatDateTime(selectedPayment.created_at)}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Method</span>
                    <strong>
                      {selectedPayment.payment_method?.replaceAll("_", " ") ||
                        "—"}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Current Status</span>
                    <strong>
                      {(selectedPayment.status || "pending").replaceAll(
                        "_",
                        " ",
                      )}
                    </strong>
                  </div>

                  <div className="payment-notes">
                    <label htmlFor="payment-admin-notes">ADMIN NOTES</label>

                    <textarea
                      id="payment-admin-notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add notes about this payment..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-modal-actions">
              <button
                className="payment-action review"
                disabled={updatingId === selectedPayment.id}
                onClick={() =>
                  updatePaymentStatus(selectedPayment.id, "under_review")
                }
              >
                {updatingId === selectedPayment.id
                  ? "Updating..."
                  : "Under Review"}
              </button>

              <button
                className="payment-action reject"
                disabled={updatingId === selectedPayment.id}
                onClick={() =>
                  updatePaymentStatus(selectedPayment.id, "rejected")
                }
              >
                Reject
              </button>

              <button
                className="payment-action verify"
                disabled={updatingId === selectedPayment.id}
                onClick={() =>
                  updatePaymentStatus(selectedPayment.id, "verified")
                }
              >
                ✓ Verify Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
