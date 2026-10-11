import { useEffect, useState } from "react";
import { getAdminToken } from "../services/adminAuth";
import "./AdminDashboard.css";

const API_URL = "https://haya-resort.onrender.com/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = getAdminToken();

        const response = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard.");
        }

        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>

          <h1>Welcome back.</h1>

          <p>Here is what is happening at Haya Resort.</p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <section className="dashboard-stats">
        <div className="dashboard-card">
          <div className="dashboard-card-top">
            <span>Total Bookings</span>
            <span className="dashboard-card-icon">▣</span>
          </div>

          <strong>{stats.totalBookings}</strong>

          <small>All reservations</small>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-top">
            <span>Pending Bookings</span>
            <span className="dashboard-card-icon">◷</span>
          </div>

          <strong>{stats.pendingBookings}</strong>

          <small>Awaiting confirmation</small>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-top">
            <span>Pending Payments</span>
            <span className="dashboard-card-icon">₱</span>
          </div>

          <strong>{stats.pendingPayments}</strong>

          <small>Need verification</small>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-top">
            <span>Verified Payments</span>
            <span className="dashboard-card-icon">✓</span>
          </div>

          <strong>{stats.verifiedPayments}</strong>

          <small>Successfully verified</small>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-top">
            <span>Customers</span>
            <span className="dashboard-card-icon">♙</span>
          </div>

          <strong>{stats.totalCustomers}</strong>

          <small>Registered guests</small>
        </div>

        <div className="dashboard-card dashboard-revenue">
          <div className="dashboard-card-top">
            <span>Verified Revenue</span>
            <span className="dashboard-card-icon">₱</span>
          </div>

          <strong>₱{Number(stats.revenue || 0).toLocaleString()}</strong>

          <small>From verified payments</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p>RECENT ACTIVITY</p>
              <h2>Latest Bookings</h2>
            </div>

            <a href="/admin/bookings">View all</a>
          </div>

          {dashboard?.recentBookings?.length > 0 ? (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.booking_reference}</strong>
                      </td>

                      <td>{booking.customer_name || "—"}</td>

                      <td>{booking.room_name || "—"}</td>

                      <td>
                        {new Date(booking.check_in).toLocaleDateString()}
                        {" → "}
                        {new Date(booking.check_out).toLocaleDateString()}
                      </td>

                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dashboard-empty">No bookings yet.</div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p>PAYMENTS</p>
              <h2>Recent Payments</h2>
            </div>

            <a href="/admin/payments">View all</a>
          </div>

          {dashboard?.recentPayments?.length > 0 ? (
            <div className="payment-list">
              {dashboard.recentPayments.map((payment) => (
                <div className="payment-item" key={payment.id}>
                  <div className="payment-avatar">
                    {payment.customer_name?.charAt(0)?.toUpperCase() || "G"}
                  </div>

                  <div className="payment-info">
                    <strong>{payment.customer_name || "Guest"}</strong>

                    <span>{payment.booking_reference || "No reference"}</span>
                  </div>

                  <div className="payment-amount">
                    <strong>
                      ₱{Number(payment.amount || 0).toLocaleString()}
                    </strong>

                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">No payments yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
