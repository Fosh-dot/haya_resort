import { useEffect, useMemo, useState } from "react";
import { getAdminToken } from "../services/adminAuth";
import "./AdminCustomers.css";

const API_URL = "https://haya-resort.onrender.com/api";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load customers.");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return customers;
    }

    return customers.filter((customer) => {
      const fullName = `${customer.first_name || ""} ${
        customer.last_name || ""
      }`.toLowerCase();

      return (
        fullName.includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  function customerName(customer) {
    return (
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
      "Guest"
    );
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loader"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="admin-customers-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">GUEST DATABASE</p>

          <h1>Customers</h1>

          <p>View and manage resort guests.</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadCustomers}
          disabled={loading}
          type="button"
        >
          ↻ Refresh
        </button>
      </div>

      {error && <div className="admin-page-error">{error}</div>}

      <div className="customers-toolbar">
        <div className="customers-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="customers-summary">
        Showing <strong>{filteredCustomers.length}</strong> of{" "}
        <strong>{customers.length}</strong> customers
      </div>

      <div className="customers-table-card">
        {filteredCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">♙</div>

            <h3>No customers found</h3>

            <p>Customers will appear here after they make a booking.</p>
          </div>
        ) : (
          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Bookings</th>
                  <th>Total Paid</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {customerName(customer).charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{customerName(customer)}</strong>

                          <span>Customer #{customer.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>{customer.email || "—"}</strong>

                      <span className="customer-secondary">
                        {customer.phone || "No phone"}
                      </span>
                    </td>

                    <td>
                      <strong>{customer.booking_count || 0}</strong>
                    </td>

                    <td>
                      <strong>
                        ₱{Number(customer.total_paid || 0).toLocaleString()}
                      </strong>
                    </td>

                    <td>{formatDate(customer.created_at)}</td>

                    <td>
                      <button
                        className="view-customer-button"
                        onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer && (
        <div
          className="customer-modal-backdrop"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <div className="customer-profile-heading">
                <div className="customer-large-avatar">
                  {customerName(selectedCustomer).charAt(0).toUpperCase()}
                </div>

                <div>
                  <p>CUSTOMER PROFILE</p>

                  <h2>{customerName(selectedCustomer)}</h2>
                </div>
              </div>

              <button
                className="customer-modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                ×
              </button>
            </div>

            <div className="customer-profile-grid">
              <div>
                <span>Email</span>
                <strong>{selectedCustomer.email || "—"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedCustomer.phone || "—"}</strong>
              </div>

              <div>
                <span>Total Bookings</span>
                <strong>{selectedCustomer.booking_count || 0}</strong>
              </div>

              <div>
                <span>Total Paid</span>
                <strong className="customer-total">
                  ₱{Number(selectedCustomer.total_paid || 0).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Customer Since</span>
                <strong>{formatDate(selectedCustomer.created_at)}</strong>
              </div>

              <div>
                <span>Customer ID</span>
                <strong>#{selectedCustomer.id}</strong>
              </div>
            </div>

            <div className="customer-modal-footer">
              <button onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
