import { useEffect, useMemo, useState } from "react";
import { getAdminToken } from "../services/adminAuth";

const API_URL = "http://localhost:5000/api";

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "rejected"];

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const customerName =
        `${booking.first_name || ""} ${booking.last_name || ""}`.trim();

      const searchableText = [
        booking.booking_reference,
        customerName,
        booking.email,
        booking.phone,
        booking.room_name,
        booking.room_category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  }

  async function updateBookingStatus(booking, status) {
    const currentStatus = booking.status;

    if (currentStatus === status) return;

    try {
      setUpdatingId(booking.id);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_URL}/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update booking status.");
      }

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? { ...item, status: data.booking?.status || status }
            : item,
        ),
      );

      setSelectedBooking((current) =>
        current?.id === booking.id
          ? { ...current, status: data.booking?.status || status }
          : current,
      );
    } catch (err) {
      setError(err.message || "Unable to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const statusStyle = (status) => {
    const styles = {
      pending: { background: "#fff4d6", color: "#946200" },
      confirmed: { background: "#e1f7e9", color: "#187443" },
      cancelled: { background: "#ffe5e5", color: "#b42318" },
      rejected: { background: "#f0e5ff", color: "#7040a0" },
    };

    return (
      styles[status] || {
        background: "#eeeeea",
        color: "#555",
      }
    );
  };

  const countStatus = (status) =>
    bookings.filter((booking) => booking.status === status).length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>RESERVATION MANAGEMENT</p>
          <h1 style={styles.title}>Bookings</h1>
          <p style={styles.subtitle}>
            Manage guest reservations and booking status.
          </p>
        </div>

        <button style={styles.refreshButton} onClick={loadBookings}>
          ↻ Refresh
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.statsGrid}>
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Pending" value={countStatus("pending")} />
        <StatCard label="Confirmed" value={countStatus("confirmed")} />
        <StatCard label="Cancelled" value={countStatus("cancelled")} />
      </section>

      <section style={styles.toolbar}>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search booking, guest, room or email..."
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={styles.select}
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </section>

      <div style={styles.resultCount}>
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No bookings found</h3>
          <p>
            {bookings.length === 0
              ? "Guest reservations will appear here."
              : "Try changing your search or status filter."}
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>BOOKING</th>
                <th style={styles.th}>GUEST</th>
                <th style={styles.th}>ROOM</th>
                <th style={styles.th}>STAY</th>
                <th style={styles.th}>AMOUNT</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => {
                const guestName =
                  `${booking.first_name || ""} ${booking.last_name || ""}`.trim() ||
                  "Guest";

                return (
                  <tr key={booking.id}>
                    <td style={styles.td}>
                      <strong>
                        {booking.booking_reference || `BOOK-${booking.id}`}
                      </strong>
                      <small style={styles.small}>
                        Created {formatDate(booking.created_at)}
                      </small>
                    </td>

                    <td style={styles.td}>
                      <strong>{guestName}</strong>
                      <small style={styles.small}>
                        {booking.email || "No email"}
                      </small>
                      <small style={styles.small}>
                        {booking.phone || "No phone"}
                      </small>
                    </td>

                    <td style={styles.td}>
                      <strong>{booking.room_name || "Room unavailable"}</strong>
                      <small style={styles.small}>
                        {booking.room_category || "Accommodation"}
                      </small>
                    </td>

                    <td style={styles.td}>
                      <div>{formatDate(booking.check_in)}</div>
                      <small style={styles.small}>
                        to {formatDate(booking.check_out)}
                      </small>
                      <small style={styles.small}>
                        {booking.nights || 0} night(s) · {booking.guests}{" "}
                        guest(s)
                      </small>
                    </td>

                    <td style={styles.td}>
                      <strong>{formatMoney(booking.total_amount)}</strong>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...statusStyle(booking.status),
                        }}
                      >
                        {booking.status || "pending"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.viewButton}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Details
                        </button>

                        <select
                          aria-label={`Update status for ${booking.booking_reference}`}
                          value={booking.status}
                          disabled={updatingId === booking.id}
                          onChange={(event) =>
                            updateBookingStatus(booking, event.target.value)
                          }
                          style={styles.statusSelect}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <div style={styles.overlay} onClick={() => setSelectedBooking(null)}>
          <section
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.eyebrow}>BOOKING DETAILS</p>
                <h2 style={styles.modalTitle}>
                  {selectedBooking.booking_reference}
                </h2>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                style={styles.closeButton}
                aria-label="Close booking details"
              >
                ✕
              </button>
            </div>

            <div style={styles.detailGrid}>
              <Detail
                label="Guest"
                value={
                  `${selectedBooking.first_name || ""} ${selectedBooking.last_name || ""}`.trim() ||
                  "Guest"
                }
              />
              <Detail label="Email" value={selectedBooking.email} />
              <Detail label="Phone" value={selectedBooking.phone} />
              <Detail label="Room" value={selectedBooking.room_name} />
              <Detail
                label="Room category"
                value={selectedBooking.room_category}
              />
              <Detail
                label="Check-in"
                value={formatDate(selectedBooking.check_in)}
              />
              <Detail
                label="Check-out"
                value={formatDate(selectedBooking.check_out)}
              />
              <Detail label="Guests" value={selectedBooking.guests} />
              <Detail label="Nights" value={selectedBooking.nights} />
              <Detail
                label="Room price per night"
                value={formatMoney(selectedBooking.room_price)}
              />
              <Detail
                label="Total amount"
                value={formatMoney(selectedBooking.total_amount)}
              />
              <Detail
                label="Created"
                value={formatDate(selectedBooking.created_at)}
              />
            </div>

            <div style={styles.requestBox}>
              <strong>Special request</strong>
              <p>{selectedBooking.special_request || "No special request."}</p>
            </div>

            <div style={styles.modalFooter}>
              <label style={styles.statusLabel}>
                Booking status
                <select
                  value={selectedBooking.status}
                  disabled={updatingId === selectedBooking.id}
                  onChange={(event) =>
                    updateBookingStatus(selectedBooking, event.target.value)
                  }
                  style={styles.select}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <button
                style={styles.closeModalButton}
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.detail}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

const styles = {
  page: {
    padding: "28px",
    color: "#252820",
    minWidth: 0,
    fontFamily: "inherit",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "26px",
  },
  eyebrow: {
    color: "#9a7947",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: "0 0 8px",
  },
  title: {
    fontSize: "30px",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#777b73",
    fontSize: "13px",
    margin: 0,
  },
  refreshButton: {
    background: "#fff",
    border: "1px solid #deded7",
    padding: "11px 17px",
    borderRadius: "7px",
    cursor: "pointer",
  },
  error: {
    padding: "14px",
    borderRadius: "8px",
    background: "#fff0f0",
    color: "#b42318",
    marginBottom: "18px",
    fontSize: "13px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    padding: "21px",
    background: "#fff",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
  },
  statLabel: {
    display: "block",
    fontSize: "12px",
    color: "#777b73",
    marginBottom: "10px",
  },
  statValue: {
    fontSize: "27px",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  searchInput: {
    flex: "1 1 300px",
    minWidth: 0,
    padding: "12px 14px",
    border: "1px solid #deded7",
    borderRadius: "7px",
    fontSize: "13px",
  },
  select: {
    padding: "11px 12px",
    border: "1px solid #deded7",
    borderRadius: "7px",
    background: "#fff",
    textTransform: "capitalize",
    maxWidth: "100%",
  },
  resultCount: {
    color: "#777b73",
    fontSize: "12px",
    marginBottom: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "45px 20px",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
    background: "#fff",
    color: "#777b73",
  },
  tableContainer: {
    overflowX: "auto",
    border: "1px solid #e9e9e3",
    borderRadius: "10px",
    background: "#fff",
  },
  table: {
    width: "100%",
    minWidth: "1000px",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "12px",
  },
  th: {
    background: "#f8f8f5",
    padding: "15px 13px",
    borderBottom: "1px solid #e9e9e3",
    color: "#777b73",
    fontSize: "10px",
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "15px 13px",
    borderBottom: "1px solid #eeeeea",
    verticalAlign: "middle",
  },
  small: {
    display: "block",
    color: "#85877f",
    fontSize: "11px",
    marginTop: "5px",
  },
  badge: {
    display: "inline-block",
    borderRadius: "20px",
    padding: "6px 9px",
    fontSize: "10px",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  viewButton: {
    background: "#293c30",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "9px 11px",
    cursor: "pointer",
  },
  statusSelect: {
    border: "1px solid #deded7",
    borderRadius: "5px",
    padding: "8px",
    background: "#fff",
    textTransform: "capitalize",
    maxWidth: "125px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.58)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
  },
  modal: {
    width: "min(760px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "center",
    marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "22px",
    margin: 0,
  },
  closeButton: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f1ed",
    cursor: "pointer",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },
  detail: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    overflowWrap: "anywhere",
  },
  requestBox: {
    marginTop: "24px",
    background: "#f8f8f5",
    borderRadius: "8px",
    padding: "15px",
    fontSize: "13px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  statusLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "12px",
    fontWeight: 600,
  },
  closeModalButton: {
    border: "none",
    background: "#293c30",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminBookings;
