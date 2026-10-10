import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GuestDetails.css";

function GuestDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const reservation = location.state || {};
  const rooms = Array.isArray(reservation.rooms) ? reservation.rooms : [];
  const checkIn = reservation.checkIn || "";
  const checkOut = reservation.checkOut || "";
  const nights = Number(reservation.nights) || 0;
  const subtotal = Number(reservation.subtotal) || 0;

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    specialRequests: "",
  });
  const [error, setError] = useState("");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const formatDate = (value) => {
    if (!value) return "Not selected";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const roomName = (room) =>
    room.name ||
    room.room_name ||
    room.title ||
    room.room_type ||
    "Resort accommodation";

  const updateGuest = (event) => {
    const { name, value } = event.target;
    setGuest((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (rooms.length === 0 || !checkIn || !checkOut) {
      setError(
        "Your room selection or stay dates are missing. Please return to Choose Room and select your stay again.",
      );
      return;
    }

    if (
      !guest.firstName.trim() ||
      !guest.lastName.trim() ||
      !guest.email.trim() ||
      !guest.phone.trim()
    ) {
      setError(
        "Please complete your first name, last name, email address, and phone number.",
      );
      return;
    }

    navigate("/booking", {
      state: {
        ...reservation,
        rooms,
        checkIn,
        checkOut,
        nights,
        subtotal,
        guest: {
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          email: guest.email.trim(),
          phone: guest.phone.trim(),
          country: guest.country.trim(),
          specialRequests: guest.specialRequests.trim(),
        },
      },
    });
  };

  return (
    <main className="guest-details-page">
      <header className="guest-details-header">
        <button
          type="button"
          className="guest-details-back"
          onClick={() =>
            navigate("/choose-room", { state: { checkIn, checkOut } })
          }
        >
          <span aria-hidden="true">←</span> Back to rooms
        </button>
        <div className="guest-details-brand">
          <span className="guest-details-brand-mark">H</span>
          <span>
            <strong>HAYA</strong>
            <small>NATURE RESORT</small>
          </span>
        </div>
        <div className="guest-details-secure">
          <span aria-hidden="true">♧</span> Secure booking
        </div>
      </header>

      <section className="guest-details-hero">
        <p className="guest-details-eyebrow">YOUR STAY, YOUR WAY</p>
        <h1>Guest details</h1>
        <p>
          Tell us who will be staying with us. Your reservation details are
          shown alongside the form.
        </p>
        <div className="guest-details-steps" aria-label="Booking progress">
          <div className="guest-details-step is-complete">
            <span>✓</span>
            <small>Choose room</small>
          </div>
          <i />
          <div className="guest-details-step is-active">
            <span>2</span>
            <small>Guest details</small>
          </div>
          <i />
          <div className="guest-details-step">
            <span>3</span>
            <small>Payment</small>
          </div>
        </div>
      </section>

      <div className="guest-details-content">
        <section className="guest-details-form-card">
          <div className="guest-details-card-heading">
            <div>
              <p className="guest-details-eyebrow">ABOUT THE GUEST</p>
              <h2>Who is checking in?</h2>
              <p>
                Fields marked with <b>*</b> are required.
              </p>
            </div>
            <span className="guest-details-heading-icon" aria-hidden="true">
              ♙
            </span>
          </div>

          {error && (
            <div className="guest-details-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="guest-details-fields">
              <label>
                First name <b>*</b>
                <input
                  name="firstName"
                  autoComplete="given-name"
                  value={guest.firstName}
                  onChange={updateGuest}
                  placeholder="Enter first name"
                  required
                />
              </label>
              <label>
                Last name <b>*</b>
                <input
                  name="lastName"
                  autoComplete="family-name"
                  value={guest.lastName}
                  onChange={updateGuest}
                  placeholder="Enter last name"
                  required
                />
              </label>
              <label>
                Email address <b>*</b>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={guest.email}
                  onChange={updateGuest}
                  placeholder="you@example.com"
                  required
                />
                <small>Your booking updates will be sent to this email.</small>
              </label>
              <label>
                Phone number <b>*</b>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={guest.phone}
                  onChange={updateGuest}
                  placeholder="+63 or your country code"
                  required
                />
              </label>
              <label className="guest-details-full-width">
                Country / region
                <input
                  name="country"
                  autoComplete="country-name"
                  value={guest.country}
                  onChange={updateGuest}
                  placeholder="Where are you travelling from?"
                />
              </label>
              <label className="guest-details-full-width">
                Special requests{" "}
                <span className="guest-details-optional">(optional)</span>
                <textarea
                  name="specialRequests"
                  value={guest.specialRequests}
                  onChange={updateGuest}
                  rows="4"
                  placeholder="Arrival time, accessibility needs, or other requests..."
                />
                <small>
                  Requests are subject to availability and resort confirmation.
                </small>
              </label>
            </div>

            <div className="guest-details-privacy-note">
              <span aria-hidden="true">◇</span>
              <p>
                Your information will be used to manage your reservation and
                communicate with you about your stay.
              </p>
            </div>

            <div className="guest-details-form-actions">
              <button
                type="button"
                className="guest-details-secondary-button"
                onClick={() =>
                  navigate("/choose-room", { state: { checkIn, checkOut } })
                }
              >
                Back
              </button>
              <button type="submit" className="guest-details-primary-button">
                Continue to payment <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </section>

        <aside className="guest-details-summary">
          <div className="guest-details-summary-top">
            <p className="guest-details-eyebrow">YOUR RESERVATION</p>
            <h2>Stay summary</h2>
            <p className="guest-details-summary-location">
              <span aria-hidden="true">⌖</span> Haya Nature Resort · Botolan,
              Zambales
            </p>
          </div>

          <div className="guest-details-date-grid">
            <div>
              <small>CHECK-IN</small>
              <strong>{formatDate(checkIn)}</strong>
              <span>From 2:00 PM</span>
            </div>
            <div>
              <small>CHECK-OUT</small>
              <strong>{formatDate(checkOut)}</strong>
              <span>Until 12:00 PM</span>
            </div>
          </div>

          <div className="guest-details-night-count">
            {nights} night{nights === 1 ? "" : "s"} · {rooms.length} room
            {rooms.length === 1 ? "" : "s"} selected
          </div>

          <div className="guest-details-room-list">
            {rooms.length ? (
              rooms.map((room, index) => {
                const id = room.id ?? room.room_id ?? index;
                const price = Number(
                  room.price ??
                    room.room_price ??
                    room.price_per_night ??
                    room.rate ??
                    0,
                );
                return (
                  <div className="guest-details-room-item" key={id}>
                    <span
                      className="guest-details-room-icon"
                      aria-hidden="true"
                    >
                      ▱
                    </span>
                    <div>
                      <strong>{roomName(room)}</strong>
                      <small>
                        {room.capacity ??
                          room.max_guests ??
                          room.guests ??
                          "Capacity on request"}
                      </small>
                    </div>
                    <span className="guest-details-room-price">
                      {formatPrice(price)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="guest-details-empty">
                No rooms were passed to this page. Go back and select a room.
              </p>
            )}
          </div>

          <div className="guest-details-subtotal">
            <span>Room subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="guest-details-price-note">
            Taxes, fees, deposit, and final payment instructions will be shown
            during the booking/payment step.
          </p>

          <div className="guest-details-help">
            <span aria-hidden="true">♡</span>
            <div>
              <strong>Need help with your booking?</strong>
              <a href="mailto:hello@hayaresort.com">hello@hayaresort.com</a>
              <a href="tel:+639338287166">+63 933 828 7166</a>
            </div>
          </div>
        </aside>
      </div>

      <footer className="guest-details-footer">
        <span>HAYA NATURE RESORT</span>
        <span>Thoughtful stays, closer to nature.</span>
      </footer>
    </main>
  );
}

export default GuestDetails;
