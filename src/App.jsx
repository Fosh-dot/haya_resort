import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

// Public pages
import Home from "./pages/public/Home";
import Rooms from "./pages/public/Rooms";
import RoomDetails from "./pages/public/RoomDetails";
import ExperienceSection from "./components/common/ExperienceSection";
import Facilities from "./pages/public/Facilities";
import Events from "./pages/public/Events";
import AboutUs from "./pages/public/AboutUs";
import FAQs from "./pages/public/FAQs";

// Contact and booking pages
import Contact from "./pages/public/Contact";
import BookNow from "./pages/public/BookNow";
import ChooseRoom from "./pages/public/ChooseRoom";
import GuestDetails from "./pages/public/GuestDetails";
import Booking from "./pages/public/Booking";

// Admin pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminBookings from "./admin/pages/AdminBookings";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminPaymentSlips from "./admin/pages/AdminPaymentSlips";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminSettings from "./admin/pages/AdminSettings";

import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

/* =========================================
   DYNAMIC BROWSER TAB TITLE
========================================= */

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const roomTitles = {
      "meria-standard": "Meria Standard",
      "kala-standard": "Kala Standard",
      "kala-deluxe": "Kala Deluxe",
      "yasmin-deluxe": "Yasmin Deluxe",
      "villa-frangipani": "Villa Frangipani",
      "allo-villa": "Allo Villa",
      "sola-villa": "Sola Villa",
      "azure-luxury-beachfront-pool-villa":
        "Azure Luxury Beachfront Pool Villa",
    };

    const titles = {
      "/experience": "Experience | Haya Resort",
      "/facilities": "Facilities | Haya Resort",
      "/events": "Events | Haya Resort",
      "/activities": "Activities | Haya Resort",
      "/about-us": "About Us | Haya Resort",
      "/faqs": "FAQs | Haya Resort",
      "/contact-us": "Contact Us | Haya Resort",
      "/join-us": "Join Us | Haya Resort",
      "/book-now": "Book Now | Haya Resort",
      "/choose-room": "Choose Your Room | Haya Resort",
      "/guest-details": "Guest Details | Haya Resort",
    };

    let title = "Haya Resort";

    if (pathname === "/" || pathname === "/home") {
      title = "Home | Haya Resort";
    } else if (pathname === "/rooms") {
      title = "Rooms | Haya Resort";
    } else if (pathname.startsWith("/rooms/")) {
      const slug = pathname.split("/")[2];

      title = roomTitles[slug]
        ? `${roomTitles[slug]} | Haya Resort`
        : "Rooms | Haya Resort";
    } else {
      title = titles[pathname] || "Haya Resort";
    }

    document.title = title;
  }, [pathname]);

  return null;
}

/* =========================================
   PLACEHOLDER PAGES
========================================= */

function ComingSoon({ title = "AVAILABLE SOON" }) {
  const isActivitiesPage = title === "AVAILABLE SOON";

  return (
    <section
      style={{
        minHeight: "55vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        boxSizing: "border-box",
        textAlign: "center",
        background: "#ffffff",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(30px, 4.5vw, 44px)",
          lineHeight: 1.3,
          letterSpacing: "0.01em",
          color: "#c9a45b",
        }}
      >
        {isActivitiesPage ? "AVAILABLE SOON" : title}
      </h1>
    </section>
  );
}

/* =========================================
   APPLICATION ROUTES
========================================= */

function AppRoutes() {
  return (
    <>
      <PageTitle />

      <Routes>
        {/* PUBLIC WEBSITE */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/home" element={<Home />} />

          {/* ROOMS OVERVIEW */}
          <Route path="/rooms" element={<Rooms />} />

          {/* INDIVIDUAL ROOM PAGES */}
          <Route path="/rooms/:id" element={<RoomDetails />} />

          {/* EXPERIENCE PAGE */}
          <Route path="/experience" element={<ExperienceSection />} />

          {/* FACILITIES PAGE */}
          <Route path="/facilities" element={<Facilities />} />

          {/* EVENTS PAGE */}
          <Route path="/events" element={<Events />} />

          {/* ACTIVITIES PAGE */}
          <Route
            path="/activities"
            element={<ComingSoon title="AVAILABLE SOON" />}
          />

          {/* ABOUT US PAGE */}
          <Route path="/about-us" element={<AboutUs />} />

          {/* FAQ PAGE */}
          <Route path="/faqs" element={<FAQs />} />

          {/* CONTACT US PAGE */}
          <Route path="/contact-us" element={<Contact />} />

          {/* JOIN US PAGE */}
          <Route path="/join-us" element={<ComingSoon title="Join Us" />} />

          {/* BOOK NOW PAGE */}
          <Route path="/book-now" element={<BookNow />} />
        </Route>

        {/* INDEPENDENT ROOM SELECTION PAGE */}
        <Route path="/choose-room" element={<ChooseRoom />} />

        {/* GUEST DETAILS PAGE */}
        <Route path="/guest-details" element={<GuestDetails />} />
        <Route path="/booking" element={<Booking />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN DASHBOARD */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="bookings" element={<AdminBookings />} />

            <Route path="payments" element={<AdminPayments />} />

            <Route path="payment-slips" element={<AdminPaymentSlips />} />

            <Route path="customers" element={<AdminCustomers />} />

            <Route path="messages" element={<AdminMessages />} />

            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/* =========================================
   APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
