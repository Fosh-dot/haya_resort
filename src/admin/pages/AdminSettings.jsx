import { useEffect, useState } from "react";
import { getAdminToken } from "../services/adminAuth";
import "./AdminSettings.css";

const API_URL = "http://localhost:5000/api";

const initialSettings = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  paymentInstructions: "",
};

function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/settings/payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load settings.");
      }

      setSettings({
        ...initialSettings,
        ...(data.settings || {}),
      });
    } catch (err) {
      setError(err.message || "Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/settings/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save settings.");
      }

      setSettings({
        ...initialSettings,
        ...(data.settings || settings),
      });

      setSuccess(data.message || "Payment settings saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loader" />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-page">
      <header className="admin-settings-header">
        <div>
          <p className="admin-settings-eyebrow">RESORT MANAGEMENT</p>
          <h1>Settings</h1>
          <p>Manage the payment information displayed to your guests.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadSettings}
          disabled={saving}
        >
          ↻ Refresh
        </button>
      </header>

      {error && (
        <div className="settings-notice settings-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="settings-notice settings-success" role="status">
          {success}
        </div>
      )}

      <form className="settings-card" onSubmit={handleSubmit}>
        <div className="settings-card-heading">
          <div className="settings-heading-icon">₱</div>

          <div>
            <p className="settings-card-eyebrow">PAYMENT CONFIGURATION</p>
            <h2>Bank Transfer Details</h2>
            <p>
              These details are used to guide guests when making their
              reservations.
            </p>
          </div>
        </div>

        <div className="settings-form-grid">
          <div className="settings-field">
            <label htmlFor="bankName">Bank Name</label>
            <input
              id="bankName"
              name="bankName"
              value={settings.bankName}
              onChange={handleChange}
              placeholder="Enter bank name"
              autoComplete="organization"
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="accountName">Account Name</label>
            <input
              id="accountName"
              name="accountName"
              value={settings.accountName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              autoComplete="off"
              required
            />
          </div>

          <div className="settings-field settings-field-full">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              value={settings.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              inputMode="numeric"
              autoComplete="off"
              required
            />
            <span className="settings-field-hint">
              Double-check the account number before saving.
            </span>
          </div>

          <div className="settings-field settings-field-full">
            <label htmlFor="paymentInstructions">Payment Instructions</label>
            <textarea
              id="paymentInstructions"
              name="paymentInstructions"
              value={settings.paymentInstructions}
              onChange={handleChange}
              placeholder="Explain how guests should complete payment and submit their payment slip."
              rows={5}
              required
            />
          </div>
        </div>

        <div className="settings-form-footer">
          <p>
            Changes are saved to your resort database when you click Save
            Changes.
          </p>

          <button
            type="submit"
            className="settings-save-button"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="settings-security-note">
        <span className="settings-security-icon">✓</span>
        <div>
          <strong>Protected settings</strong>
          <p>
            Updating payment information requires an authenticated admin
            session.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
