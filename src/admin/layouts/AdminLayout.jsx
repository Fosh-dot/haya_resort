import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAdmin, logoutAdmin } from "../services/adminAuth";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const admin = getAdmin();

  const navigation = [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
      ],
    },
    {
      section: "Reservations",
      items: [
        { label: "Bookings", path: "/admin/bookings", icon: "calendar" },
        { label: "Payments", path: "/admin/payments", icon: "wallet" },
        {
          label: "Payment Slips",
          path: "/admin/payment-slips",
          icon: "document",
        },
      ],
    },
    {
      section: "Guests",
      items: [
        { label: "Customers", path: "/admin/customers", icon: "users" },
        { label: "Messages", path: "/admin/messages", icon: "message" },
      ],
    },
    {
      section: "Resort",
      items: [{ label: "Website", path: "/admin/content", icon: "website" }],
    },
    {
      section: "System",
      items: [{ label: "Settings", path: "/admin/settings", icon: "settings" }],
    },
  ];

  const icons = {
    dashboard: "▦",
    calendar: "□",
    wallet: "◇",
    document: "▤",
    users: "○",
    message: "□",
    website: "◈",
    settings: "⚙",
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo-area">
          <div className="admin-logo-mark">H</div>

          <div className="admin-logo-copy">
            <span className="admin-logo-name">HAYA</span>
            <span className="admin-logo-subtitle">RESORT</span>
          </div>
        </div>

        <div className="admin-sidebar-label">MANAGEMENT</div>

        <nav className="admin-navigation">
          {navigation.map((group) => (
            <div className="admin-nav-group" key={group.section}>
              <div className="admin-nav-section">{group.section}</div>

              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="admin-nav-icon">{icons[item.icon]}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="admin-user-info">
              <strong>{admin?.name || "Administrator"}</strong>
              <span>{admin?.role || "Administrator"}</span>
            </div>
          </div>

          <button className="admin-logout-button" onClick={handleLogout}>
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-topbar-status">
              <i></i>
              SYSTEM ONLINE
            </span>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-property">
              <span>PROPERTY</span>
              <strong>Haya Resort</strong>
            </div>

            <div className="admin-topbar-divider"></div>

            <div className="admin-topbar-profile">
              <div className="admin-topbar-avatar">
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div>
                <strong>{admin?.name || "Administrator"}</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
