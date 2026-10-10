import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/adminAuth";
import "../Admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await loginAdmin(form.email.trim(), form.password);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-brand">
        <span>HAYA</span>
        <small>RESORT</small>
      </div>

      <section className="admin-login-card">
        <div className="admin-login-heading">
          <p>ADMINISTRATION</p>

          <h1>Welcome back</h1>

          <span>Sign in to manage Haya Resort.</span>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email address</label>

            <input
              id="admin-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@hayaresort.com"
              autoComplete="email"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="admin-login-footer">Haya Resort Management System</div>
      </section>
    </main>
  );
}

export default AdminLogin;
