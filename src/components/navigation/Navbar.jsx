import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import hayaLogo from "../../assets/haya/haya-logo.png";

const navigation = [
  { label: "Home", path: "/" },
  {
    label: "Rooms",
    path: "/rooms",
    children: [
      { label: "Meria Standard", path: "/rooms/meria-standard" },
      { label: "Kala Standard", path: "/rooms/kala-standard" },
      { label: "Kala Deluxe", path: "/rooms/kala-deluxe" },
      { label: "Yasmin Deluxe", path: "/rooms/yasmin-deluxe" },
      { label: "Villa Frangipani", path: "/rooms/villa-frangipani" },
      { label: "Allo Villa", path: "/rooms/allo-villa" },
      { label: "Sola Villa", path: "/rooms/sola-villa" },
    ],
  },
  {
    label: "Experience",
    path: "/experience",
    children: [
      { label: "Facilities", path: "/facilities" },
      { label: "Events", path: "/events" },
      { label: "Activities", path: "/activities" },
    ],
  },
  { label: "About Us", path: "/about-us" },
  { label: "FAQs", path: "/faqs" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Join Us", path: "/join-us" },
  { label: "Book Now", path: "/book-now" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState({
    Rooms: false,
    Experience: false,
  });

  const toggleMobileDropdown = (label) => {
    setMobileDropdownOpen((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen({
      Rooms: false,
      Experience: false,
    });
  };

  return (
    <header className="haya-navbar">
      <Link
        to="/"
        className="haya-navbar-logo"
        aria-label="Haya Nature Resort Home"
        onClick={closeMobileMenu}
      >
        <img src={hayaLogo} alt="Haya Nature Resort" />
      </Link>

      <button
        className="haya-mobile-toggle"
        type="button"
        aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`haya-navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}
        aria-label="Main navigation"
      >
        {navigation.map((item) => {
          if (item.children) {
            return (
              <div
                className={`haya-nav-dropdown ${
                  mobileDropdownOpen[item.label] ? "mobile-dropdown-open" : ""
                }`}
                key={item.label}
              >
                <div className="haya-dropdown-heading">
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `haya-navbar-link haya-dropdown-trigger ${
                        isActive ? "active" : ""
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>

                  <button
                    type="button"
                    className="haya-dropdown-toggle"
                    aria-label={`Toggle ${item.label} menu`}
                    aria-expanded={Boolean(mobileDropdownOpen[item.label])}
                    onClick={() => toggleMobileDropdown(item.label)}
                  >
                    <span aria-hidden="true">⌄</span>
                  </button>
                </div>

                <div className="haya-dropdown-menu">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `haya-dropdown-item ${isActive ? "active" : ""}`
                      }
                      onClick={closeMobileMenu}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `haya-navbar-link ${isActive ? "active" : ""}`
              }
              onClick={closeMobileMenu}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
