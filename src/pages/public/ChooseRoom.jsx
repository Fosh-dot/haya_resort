import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChooseRoom.css";

import meriaStandardImage from "../../assets/haya/rooms/meria-standard.jpg";
import meriaImage2 from "../../assets/haya/rooms/meria-standard2.jpg";
import meriaImage3 from "../../assets/haya/rooms/meria-standard3.jpg";

import kalaStandardImage from "../../assets/haya/rooms/kala-standard.jpg";
import kalaStandardImage2 from "../../assets/haya/rooms/kala-standard2.png";

import kalaDeluxeImage from "../../assets/haya/rooms/kala-deluxe.jpg";
import kalaDeluxeImage2 from "../../assets/haya/rooms/kala-deluxe2.png";
import kalaDeluxeImage3 from "../../assets/haya/rooms/kala-deluxe3.jpeg";

import yasminDeluxeImage from "../../assets/haya/rooms/yasmin-deluxe.jpg";
import yasminDeluxeImage2 from "../../assets/haya/rooms/yasmin-deluxe2.png";

import villaFrangipaniImage from "../../assets/haya/rooms/villa-frangipani.jpg";
import villaFrangipaniImage2 from "../../assets/haya/rooms/villa-frangipani2.jpg";

import alloVilla1 from "../../assets/haya/rooms/allo-villa1.jpg";
import alloVilla2 from "../../assets/haya/rooms/allo-villa2.jpg";
import alloVilla3 from "../../assets/haya/rooms/allo-villa3.jpg";
import alloVilla4 from "../../assets/haya/rooms/allo-villa4.jpg";
import alloVilla5 from "../../assets/haya/rooms/allo-villa5.jpg";
import alloVilla6 from "../../assets/haya/rooms/allo-villa6.jpg";
import alloVilla7 from "../../assets/haya/rooms/allo-villa7.jpg";
import alloVilla8 from "../../assets/haya/rooms/allo-villa8.jpg";
import alloVilla9 from "../../assets/haya/rooms/allo-villa9.jpg";
import alloVilla10 from "../../assets/haya/rooms/allo-villa10.jpg";
import alloVilla11 from "../../assets/haya/rooms/allo-villa11.jpg";

import solaVilla1 from "../../assets/haya/rooms/sola-villa1.png";
import solaVilla2 from "../../assets/haya/rooms/sola-villa2.png";
import solaVilla3 from "../../assets/haya/rooms/sola-villa3.png";
import solaVilla4 from "../../assets/haya/rooms/sola-villa4.png";
import solaVilla5 from "../../assets/haya/rooms/sola-villa5.png";
import solaVilla6 from "../../assets/haya/rooms/sola-villa6.png";
import solaVilla7 from "../../assets/haya/rooms/sola-villa7.png";
import solaVilla8 from "../../assets/haya/rooms/sola-villa8.png";
import solaVilla9 from "../../assets/haya/rooms/sola-villa9.png";
import solaVilla10 from "../../assets/haya/rooms/sola-villa10.png";
import solaVilla11 from "../../assets/haya/rooms/sola-villa11.png";
import solaVilla12 from "../../assets/haya/rooms/sola-villa12.jpg";
import solaVilla13 from "../../assets/haya/rooms/sola-villa13.png";
import solaVilla14 from "../../assets/haya/rooms/sola-villa14.png";

import azureVilla1 from "../../assets/haya/rooms/azure-villa.jpg";
import azureVilla2 from "../../assets/haya/rooms/azure-villa2.jpg";
import azureVilla3 from "../../assets/haya/rooms/azure-villa3.jpg";
import azureVilla4 from "../../assets/haya/rooms/azure-villa4.jpg";
import azureVilla5 from "../../assets/haya/rooms/azure-villa5.jpg";
import azureVilla6 from "../../assets/haya/rooms/azure-villa6.jpg";
import azureVilla7 from "../../assets/haya/rooms/azure-villa7.jpg";
import azureVilla8 from "../../assets/haya/rooms/azure-villa8.jpg";
import azureVilla9 from "../../assets/haya/rooms/azure-villa9.jpg";
import azureVilla10 from "../../assets/haya/rooms/azure-villa10.jpg";
import azureVilla11 from "../../assets/haya/rooms/azure-villa11.jpg";
import azureVilla12 from "../../assets/haya/rooms/azure-villa12.jpg";

// Production backend. If Vercel's VITE_API_URL is set, it may contain
// either the backend origin or the origin followed by /api; normalize both.
const CONFIGURED_API_URL = (
  import.meta.env.VITE_API_URL || "https://haya-resort.onrender.com"
)
  .trim()
  .replace(/\/+$/, "");
const API_BASE_URL = CONFIGURED_API_URL.replace(/\/api$/i, "");
const API_URL = `${API_BASE_URL}/api`;

/* =========================================
   ROOM GALLERIES — MATCH ROOM DETAILS PAGE
========================================= */

const normalizeRoomName = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const ROOM_IMAGES = {
  "meria standard": [meriaStandardImage, meriaImage2, meriaImage3],
  "kala standard": [kalaStandardImage2, kalaStandardImage, meriaImage3],
  "kala deluxe": [kalaDeluxeImage, kalaDeluxeImage2, kalaDeluxeImage3],
  "yasmin deluxe": [yasminDeluxeImage, yasminDeluxeImage2, kalaDeluxeImage3],
  "villa frangipani": [
    villaFrangipaniImage,
    villaFrangipaniImage2,
    kalaDeluxeImage3,
  ],
  "allo villa": [
    alloVilla1,
    alloVilla2,
    alloVilla3,
    alloVilla4,
    alloVilla5,
    alloVilla6,
    alloVilla7,
    alloVilla8,
    alloVilla9,
    alloVilla10,
    alloVilla11,
  ],
  "sola villa": [
    solaVilla1,
    solaVilla2,
    solaVilla3,
    solaVilla4,
    solaVilla5,
    solaVilla6,
    solaVilla7,
    solaVilla8,
    solaVilla9,
    solaVilla10,
    solaVilla11,
    solaVilla12,
    solaVilla13,
    solaVilla14,
  ],
  "azure luxury beachfront pool villa": [
    azureVilla1,
    azureVilla2,
    azureVilla3,
    azureVilla4,
    azureVilla5,
    azureVilla6,
    azureVilla7,
    azureVilla8,
    azureVilla9,
    azureVilla10,
    azureVilla11,
    azureVilla12,
  ],
};

const ROOM_PRICING = {
  "meria standard": { original: 7000, discounted: 5600 },
  "kala standard": { original: 8330, discounted: 6664 },
  "kala deluxe": { original: 8768, discounted: 7014 },
  "yasmin deluxe": { original: 10313, discounted: 8250 },
  "villa frangipani": { original: 15313, discounted: 12250 },
  "sola villa": { original: 18350, discounted: 14680 },
  "allo villa": { original: 21000, discounted: 16800 },
  "azure luxury beachfront pool villa": { original: 27500, discounted: 22000 },
};

// Azure is shown as the eighth card for now. Its gallery and full room details
// can be connected when it is added to the main Rooms data.
const AZURE_ROOM_PLACEHOLDER = {
  id: "azure-luxury-beachfront-pool-villa",
  name: "Azure Luxury Beachfront Pool Villa",
  capacity: null,
  description:
    "Discover the Azure Luxury Beachfront Pool Villa at Haya Nature Resort.",
  room_number: null,
  code: "R8",
  price: 22000,
};

/* =========================================
   MAIN CHOOSE ROOM PAGE
========================================= */

function ChooseRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(location.state?.checkIn || "");

  const [checkOut, setCheckOut] = useState(location.state?.checkOut || "");

  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currency, setCurrency] = useState("PHP");

  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    petFriendly: false,
    pool: false,
    twoBedrooms: false,
  });

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(`${checkOut}T12:00:00`) -
              new Date(`${checkIn}T12:00:00`)) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  /* =========================================
     LOAD ROOMS FROM BACKEND
  ========================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadRooms() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/rooms`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            `Rooms API returned HTTP ${response.status}. Please try again shortly.`,
          );
        }

        const data = await response.json();
        // Support the common response shapes used by Express APIs.
        const roomList = Array.isArray(data)
          ? data
          : Array.isArray(data?.rooms)
            ? data.rooms
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.results)
                ? data.results
                : Array.isArray(data?.data?.rooms)
                  ? data.data.rooms
                  : null;

        if (!Array.isArray(roomList)) {
          console.error("Unexpected rooms API response:", data);
          throw new Error(
            "The backend responded, but its rooms response format was unexpected.",
          );
        }

        if (!cancelled) {
          setRooms(roomList);
        }
      } catch (err) {
        console.error("Failed to load resort rooms:", err);

        if (!cancelled) {
          setError(
            err?.message ||
              "We couldn't load the rooms. Please refresh and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================
     HELPER FUNCTIONS
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "Select date";

    return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "Contact resort";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getRoomName = (room) =>
    room.name ||
    room.room_name ||
    room.title ||
    room.room_type ||
    "Resort Accommodation";

  const getRoomImage = (room) => {
    const image =
      room.image || room.image_url || room.room_image || room.imageUrl;

    if (!image || typeof image !== "string") {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:") ||
      image.startsWith("/")
    ) {
      return image;
    }

    return `${API_BASE_URL}/${image.replace(/^\/+/, "")}`;
  };

  const getRoomPrice = (room) =>
    room.price ?? room.room_price ?? room.price_per_night ?? room.rate ?? null;

  const getCapacity = (room) =>
    room.capacity ??
    room.max_guests ??
    room.guests ??
    room.max_occupancy ??
    null;

  const getDescription = (room) =>
    room.description || room.room_description || room.details || "";

  const isPetFriendly = (room) =>
    /pet.?friendly/i.test(`${getRoomName(room)} ${getDescription(room)}`);

  /* =========================================
     FILTER ACCOMMODATIONS
  ========================================= */

  const azureAlreadyExists = rooms.some(
    (room) =>
      normalizeRoomName(getRoomName(room)) ===
      "azure luxury beachfront pool villa",
  );
  const roomsWithAzure = azureAlreadyExists
    ? rooms
    : [...rooms, AZURE_ROOM_PLACEHOLDER];

  const filteredRooms = roomsWithAzure.filter((room) => {
    const text = `${getRoomName(room)} ${getDescription(room)}`;

    if (filters.petFriendly && !isPetFriendly(room)) {
      return false;
    }

    if (filters.pool && !/pool/i.test(text)) {
      return false;
    }

    if (filters.twoBedrooms && !/2.?br|two.?bedroom|2.?bedroom/i.test(text)) {
      return false;
    }

    return true;
  });

  /* =========================================
     SEARCH DATES
  ========================================= */

  const handleDateSearch = (event) => {
    event.preventDefault();

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setMessage("Please select valid check-in and check-out dates.");
      return;
    }

    if (checkIn < todayString) {
      setMessage("Check-in cannot be in the past.");
      return;
    }

    setMessage("");
    setSelectedRooms([]);

    navigate("/choose-room", {
      replace: true,
      state: {
        checkIn,
        checkOut,
      },
    });
  };

  /* =========================================
     ADD OR REMOVE ROOM
  ========================================= */

  const handleAddRoom = (room) => {
    const roomId = room.id ?? room.room_id;

    setSelectedRooms((previous) => {
      const exists = previous.some(
        (item) => (item.id ?? item.room_id) === roomId,
      );

      if (exists) {
        return previous.filter((item) => (item.id ?? item.room_id) !== roomId);
      }

      return [...previous, room];
    });

    setMessage("");
  };

  /* =========================================
     CONTINUE TO BOOKING
  ========================================= */

  const handleContinue = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setMessage("Please choose your stay dates first.");
      return;
    }

    if (selectedRooms.length === 0) {
      setMessage("Please add at least one room.");
      return;
    }

    navigate("/guest-details", {
      state: {
        checkIn,
        checkOut,
        rooms: selectedRooms,
        nights,
        subtotal: selectedRooms.reduce((sum, room) => {
          const key = normalizeRoomName(getRoomName(room));
          const nightly =
            ROOM_PRICING[key]?.discounted ?? Number(getRoomPrice(room) || 0);
          return sum + nightly * nights;
        }, 0),
      },
    });
  };

  /* =========================================
     PAGE UI
  ========================================= */

  return (
    <main className="choose-room-page">
      <header className="choose-room-header">
        <div className="choose-room-brand">Haya Nature Resort</div>

        <form className="choose-room-searchbar" onSubmit={handleDateSearch}>
          <div className="choose-room-date">
            <span className="choose-room-calendar">▦</span>

            <label htmlFor="room-check-in">
              <span>Check In</span>

              <input
                id="room-check-in"
                type="date"
                value={checkIn}
                min={todayString}
                onChange={(event) => setCheckIn(event.target.value)}
                required
              />
            </label>
          </div>

          <span className="choose-room-date-arrow">→</span>

          <div className="choose-room-date">
            <label htmlFor="room-check-out">
              <span>Check Out</span>

              <input
                id="room-check-out"
                type="date"
                value={checkOut}
                min={checkIn || todayString}
                onChange={(event) => setCheckOut(event.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit" className="choose-room-search-button">
            Search
          </button>
        </form>

        <div className="choose-room-header-actions">
          <button type="button" onClick={() => setShowPromo(!showPromo)}>
            ♢ Promo Code
          </button>

          <button type="button" onClick={() => setShowFilters(!showFilters)}>
            ☷ Filters
          </button>

          <label className="choose-room-currency">
            <span>◎</span>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              aria-label="Currency"
            >
              <option value="NGN">NGN</option>
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </div>
      </header>

      {showPromo && (
        <form
          className="choose-room-promo"
          onSubmit={(event) => {
            event.preventDefault();

            setMessage(
              promoCode.trim()
                ? "Promo code received. Discount validation will be connected to the booking backend."
                : "Please enter a promo code.",
            );
          }}
        >
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
          />

          <button type="submit">Apply</button>
        </form>
      )}

      {showFilters && (
        <section className="choose-room-filters">
          <strong>Filter accommodations</strong>

          <label>
            <input
              type="checkbox"
              checked={filters.petFriendly}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  petFriendly: event.target.checked,
                }))
              }
            />
            Pet friendly
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.pool}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  pool: event.target.checked,
                }))
              }
            />
            Pool
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.twoBedrooms}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  twoBedrooms: event.target.checked,
                }))
              }
            />
            Two bedrooms
          </label>

          <button
            type="button"
            onClick={() =>
              setFilters({
                petFriendly: false,
                pool: false,
                twoBedrooms: false,
              })
            }
          >
            Clear filters
          </button>
        </section>
      )}

      <section className="choose-room-main">
        <div className="choose-room-results-heading">
          <div>
            <p className="choose-room-eyebrow">HAYA NATURE RESORT</p>

            <h1>Choose your room</h1>

            <p className="choose-room-stay-dates">
              {formatDate(checkIn)} <span>→</span> {formatDate(checkOut)}
              {nights > 0 && ` · ${nights} night${nights === 1 ? "" : "s"}`}
            </p>
          </div>

          {selectedRooms.length > 0 && (
            <div className="choose-room-selection-count">
              {selectedRooms.length} room
              {selectedRooms.length === 1 ? "" : "s"} selected
            </div>
          )}
        </div>

        {message && (
          <div className="choose-room-message" role="status">
            {message}
          </div>
        )}

        {loading ? (
          <div className="choose-room-status">Loading accommodations...</div>
        ) : error ? (
          <div className="choose-room-status choose-room-status-error">
            {error}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="choose-room-status">
            No accommodations found for these filters.
          </div>
        ) : (
          <div className="choose-room-layout">
            <div className="choose-room-grid">
              {filteredRooms.map((room, index) => (
                <RoomCard
                  key={room.id ?? room.room_id ?? index}
                  room={room}
                  index={index}
                  nights={nights}
                  formatPrice={formatPrice}
                  getRoomName={getRoomName}
                  getRoomImage={getRoomImage}
                  getRoomPrice={getRoomPrice}
                  getCapacity={getCapacity}
                  getDescription={getDescription}
                  selected={selectedRooms.some(
                    (item) =>
                      (item.id ?? item.room_id) === (room.id ?? room.room_id),
                  )}
                  onAdd={() => handleAddRoom(room)}
                  onViewDetails={() => {
                    const roomSlug = normalizeRoomName(
                      getRoomName(room),
                    ).replace(/\s+/g, "-");
                    navigate(`/rooms/${roomSlug}`);
                  }}
                />
              ))}
            </div>

            <aside
              className="choose-room-selection-panel"
              aria-label="Reservation summary"
            >
              {selectedRooms.length === 0 ? (
                <div className="choose-room-empty-panel">
                  <div className="choose-room-empty-icon" aria-hidden="true">
                    ▱
                  </div>
                  <p>No Accommodations Added</p>
                </div>
              ) : (
                <div className="choose-room-summary-content">
                  <h2>Reservation Summary</h2>
                  <div className="choose-room-summary-dates">
                    <span>{formatDate(checkIn)}</span>
                    <span>→</span>
                    <span>{formatDate(checkOut)}</span>
                  </div>
                  <div className="choose-room-summary-nights">
                    ☾ {nights} Night{nights === 1 ? "" : "s"}
                  </div>
                  <div className="choose-room-summary-items">
                    {selectedRooms.map((room, index) => {
                      const key = normalizeRoomName(getRoomName(room));
                      const nightly =
                        ROOM_PRICING[key]?.discounted ??
                        Number(getRoomPrice(room) || 0);
                      const roomTotal = nightly * nights;
                      return (
                        <div
                          className="choose-room-summary-item"
                          key={room.id ?? room.room_id ?? index}
                        >
                          <div className="choose-room-summary-item-heading">
                            <div>
                              <strong>
                                {room.room_number
                                  ? `R${room.room_number} `
                                  : room.code
                                    ? `${room.code} `
                                    : ""}
                                {getRoomName(room)}
                              </strong>
                              <small>
                                {getCapacity(room) != null
                                  ? `♙ ${getCapacity(room)} guests`
                                  : "Guest capacity shown on room details"}
                              </small>
                            </div>
                            <strong>{formatPrice(roomTotal || nightly)}</strong>
                          </div>
                          <button
                            type="button"
                            className="choose-room-summary-remove"
                            onClick={() => handleAddRoom(room)}
                            aria-label={`Remove ${getRoomName(room)}`}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="choose-room-summary-totals">
                    <div>
                      <span>Subtotal</span>
                      <strong>
                        {formatPrice(
                          selectedRooms.reduce((sum, room) => {
                            const key = normalizeRoomName(getRoomName(room));
                            return (
                              sum +
                              (ROOM_PRICING[key]?.discounted ??
                                Number(getRoomPrice(room) || 0)) *
                                nights
                            );
                          }, 0),
                        )}
                      </strong>
                    </div>
                    <p>
                      Taxes, fees and deposit will be calculated using the
                      resort's configured booking settings.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="choose-room-book-now"
                    onClick={handleContinue}
                  >
                    Book Now
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}
      </section>

      <section
        className="choose-room-property-section"
        aria-label="Resort information"
      >
        <div className="choose-room-property-card">
          <div className="choose-room-property-information">
            <h2>Property Information</h2>
            <p>
              <strong>Sanctuary of Serenity:</strong> A private escape designed
              to soothe the senses and nurture the soul.
            </p>
            <p>
              <strong>Accessible Escape:</strong> A scenic 4–5 hour drive via
              NLEX, SCTEX, and Olongapo-Bugallon Road brings you straight to
              paradise.
            </p>
            <p>
              <strong>Unique Landscape:</strong> Located on the historic,
              beautiful black sands of Botolan, Zambales, with views of both sea
              and mountains.
            </p>
            <p>
              <strong>Quiet Luxury:</strong> Inspired by the Kalachuchi flower,
              we focus on intimacy, privacy, and the unembellished beauty of
              nature.
            </p>
          </div>
          <div className="choose-room-property-amenities">
            <div className="choose-room-property-heading">
              <h2>Property Amenities</h2>
              <span>Comforts for your stay</span>
            </div>
            <div className="choose-room-amenities-grid">
              {[
                ["▣", "Air conditioning"],
                ["P", "Guest parking"],
                ["♨", "Room service"],
                ["♧", "Bar"],
                ["◉", "Internet"],
                ["♒", "Swimming pool"],
                ["♙", "Beach chairs / loungers"],
                ["♧", "Family rooms"],
                ["⊘", "Non-smoking rooms"],
                ["♡", "24-hour security"],
                ["♧", "Garden"],
                ["♨", "Restaurant"],
                ["▤", "Baggage storage"],
                ["☂", "Beach umbrellas"],
                ["☀", "Beachfront"],
                ["♨", "BBQ facilities"],
              ].map(([icon, label]) => (
                <div className="choose-room-amenity" key={label}>
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="choose-room-property-contact">
            <div className="choose-room-property-address">
              <h2>Address and Contact</h2>
              <p>
                Lot 7409, CAD. 614-D
                <br />
                Botolan
                <br />
                Zambales, Philippines 2202
              </p>
              <a href="tel:+639338287166">+639338287166</a>
              <a href="mailto:hello@hayaresort.com">hello@hayaresort.com</a>
            </div>
            <div className="choose-room-property-map">
              <iframe
                title="Haya Nature Resort location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=119.85%2C15.20%2C120.05%2C15.35&layer=mapnik"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://www.openstreetmap.org/?mlat=15.27&mlon=119.95#map=12/15.27/119.95"
                target="_blank"
                rel="noreferrer"
              >
                Open map ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="choose-room-policies-section"
        aria-label="Resort policies and terms"
      >
        <div className="choose-room-policies-card">
          <section className="choose-room-policy-block">
            <h2>Check-In and Check-Out Policies</h2>
            <ul>
              <li>
                <strong>Check-in:</strong> 2:00 PM
              </li>
              <li>
                <strong>Check-out:</strong> 12:00 PM
              </li>
            </ul>
          </section>

          <section className="choose-room-policy-block">
            <h2>Property and Cancellation Policies</h2>
            <p>
              <strong>
                All requests for transfers or rebookings are subject to the
                approval and availability of the Haya Nature Resort Team.
              </strong>
            </p>
            <ul>
              <li>
                <strong>Non-Refundable Payments:</strong> Please note that all
                payments made for bookings are non-refundable.
              </li>
              <li>
                <strong>Notification for Date Changes:</strong> You can transfer
                your booking to a new date if you notify us in writing at least
                15 days before your original check-in date. This helps you avoid
                penalties. All rebooking requests must be sent to
                hello@hayaresort.com.
              </li>
              <li>
                <strong>Transfer Fees:</strong>
                <ul>
                  <li>
                    If you rebook within 90 days of your original check-in date,
                    there is no transfer charge.
                  </li>
                  <li>
                    If you rebook after 90 days from your original check-in
                    date, a 30% rebooking fee will apply.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Room Upgrades:</strong> If your originally booked room
                isn't available on your new dates and an upgraded room is the
                only option, you will be charged the difference in room rate.
              </li>
              <li>
                <strong>Providing New Dates:</strong> You must provide your new
                dates on the same day you submit your written notification.
                Failure to provide new dates will result in the forfeiture of
                your booking.
              </li>
              <li>
                <strong>One-Time Transfer:</strong> Bookings can only be
                transferred once. Once your booking confirmation for the new
                dates is sent, no further changes to the date can be made.
              </li>
              <li>
                <strong>Rate Adjustments:</strong> The new booking will be based
                on the prevailing room rates for your selected new dates. Please
                be aware that prices are subject to change without prior notice.
              </li>
              <li>
                <strong>Promotional Rates:</strong> Transferred bookings are not
                valid with any ongoing promotions on the new dates.
              </li>
              <li>
                <strong>No Cancellations:</strong> Haya Nature Resort does not
                allow or entertain any cancellations.
              </li>
              <li>
                <strong>Shortened Stays (In-House Guests):</strong> For guests
                already staying at the resort, there will be no refund,
                cancellation, or transfer if you shorten your stay.
              </li>
              <li>
                <strong>Extra Persons and Consumables:</strong> Payments made
                for additional persons are non-refundable and cannot be credited
                towards other consumables or services.
              </li>
            </ul>
          </section>

          <section className="choose-room-policy-block">
            <h2>Force Majeure Policy</h2>
            <p>
              <strong>General:</strong> Neither party shall be responsible for
              any failure to perform its obligations under this agreement if the
              performance is prevented, hindered, or delayed by a Force Majeure
              Event. A Force Majeure Event refers to any event beyond the
              reasonable control of the party, including but not limited to acts
              of God, natural disasters (such as earthquakes, floods, typhoons),
              war, or government-mandated travel restrictions.
            </p>
            <p>
              <strong>Earthquake Policy:</strong> In the specific event of an
              earthquake, a confirmed booking may be rebooked to a future date
              (subject to availability) or converted to resort credit without
              penalty if one or more of the following conditions are met:
            </p>
            <ul>
              <li>
                <strong>Resort Non-Operational:</strong> The earthquake causes
                significant structural damage to the resort, loss of essential
                utilities (power, water), or other issues that render the
                property unsafe or uninhabitable, as determined solely by Resort
                Management.
              </li>
              <li>
                <strong>Government-Mandated Closure:</strong> A government
                agency or official body issues a formal evacuation order for the
                area in which the resort is located.
              </li>
              <li>
                <strong>Physical Inaccessibility:</strong> Essential access
                routes (e.g. major highways, bridges, or the only road to the
                resort) are officially closed by authorities, making travel to
                the resort impossible.
              </li>
            </ul>
            <p>
              <strong>Exclusions:</strong> This policy does not apply to
              situations where the guest's decision not to travel is based on
              personal apprehension, fear of aftershocks, or general advisories
              that do not directly impact the operational status or
              accessibility of the resort. If the resort remains fully
              operational, safe, and accessible, our standard cancellation
              policy will apply. We strongly recommend all guests secure
              comprehensive travel insurance.
            </p>
          </section>

          <section className="choose-room-policy-block">
            <h2>Terms and Conditions</h2>
            <p>
              All bookings are subject to room availability and the resort
              policies stated above. Please contact{" "}
              <a href="mailto:hello@hayaresort.com">hello@hayaresort.com</a> if
              you need clarification before completing your reservation.
            </p>
          </section>
        </div>
      </section>

      {selectedRooms.length > 0 && (
        <div className="choose-room-bottom-bar">
          <div>
            <strong>
              {selectedRooms.length} accommodation
              {selectedRooms.length === 1 ? "" : "s"} selected
            </strong>

            <span>
              {nights} night{nights === 1 ? "" : "s"}
            </span>
          </div>

          <button type="button" onClick={handleContinue}>
            Continue to booking →
          </button>
        </div>
      )}
    </main>
  );
}

/* =========================================
   INDIVIDUAL ROOM CARD
========================================= */

function RoomCard({
  room,
  index,
  nights,
  formatPrice,
  getRoomName,
  getRoomImage,
  getRoomPrice,
  getCapacity,
  getDescription,
  selected,
  onAdd,
  onViewDetails,
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showOffers, setShowOffers] = useState(false);

  const name = getRoomName(room);
  const roomPricing = ROOM_PRICING[normalizeRoomName(getRoomName(room))];
  const price = roomPricing?.discounted ?? getRoomPrice(room);
  const capacity = getCapacity(room);
  const description = getDescription(room);

  const roomKey = normalizeRoomName(name);

  /*
    Prefer local images for a matching room.
    If none exist, use images supplied by the database.
  */

  const localImages = ROOM_IMAGES[roomKey] || [];

  const databaseImages = [
    room.image,
    room.image_url,
    room.room_image,
    room.imageUrl,
    ...(Array.isArray(room.images) ? room.images : []),
  ].filter((image) => typeof image === "string" && image.trim());

  // Use the exact same image gallery and ordering as RoomDetails.jsx.
  // Keep database images as a fallback for any unlisted accommodation.
  const imageList = localImages.length > 0 ? localImages : databaseImages;

  const currentImage = imageList[imageIndex] || getRoomImage(room);

  /*
    Reset the carousel when the displayed room changes.
  */

  useEffect(() => {
    setImageIndex(0);
  }, [roomKey]);

  const changeImage = (direction) => {
    if (imageList.length <= 1) return;

    setImageIndex((current) => {
      return (current + direction + imageList.length) % imageList.length;
    });
  };

  /*
    Vite's imported local images already have usable URLs.
    Database image paths may need the backend base URL.
  */

  const getDisplayImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:") ||
      image.startsWith("/")
    ) {
      return image;
    }

    return `${API_BASE_URL}/${image.replace(/^\/+/, "")}`;
  };

  return (
    <article className="choose-room-card">
      <div className="choose-room-image-area">
        {currentImage ? (
          <img
            key={currentImage}
            className="choose-room-room-image"
            src={getDisplayImageUrl(currentImage)}
            alt={`${name} at Haya Nature Resort`}
            onError={(event) => {
              console.error(`Unable to load image for ${name}:`, currentImage);

              event.currentTarget.style.visibility = "hidden";
            }}
          />
        ) : (
          <div className="choose-room-image-placeholder">
            <span>HAYA</span>
            <small>NATURE RESORT</small>
          </div>
        )}

        <span className="choose-room-room-number">
          {room.room_number
            ? `R${room.room_number}`
            : room.code || `R${index + 1}`}
        </span>

        {imageList.length > 1 && (
          <>
            <button
              type="button"
              className="choose-room-image-arrow choose-room-image-arrow-left"
              onClick={() => changeImage(-1)}
              aria-label={`Previous image of ${name}`}
            >
              ‹
            </button>

            <button
              type="button"
              className="choose-room-image-arrow choose-room-image-arrow-right"
              onClick={() => changeImage(1)}
              aria-label={`Next image of ${name}`}
            >
              ›
            </button>

            <span className="choose-room-image-counter">
              {imageIndex + 1}/{imageList.length}
            </span>
          </>
        )}
      </div>

      <div className="choose-room-card-content">
        <div className="choose-room-card-heading">
          <div>
            <h2>{name}</h2>

            {capacity != null && (
              <p className="choose-room-capacity">♙ Up to {capacity} guests</p>
            )}
          </div>

          {selected && (
            <span className="choose-room-selected-badge">Added ✓</span>
          )}
        </div>

        <p className="choose-room-description">
          {description || "Discover your stay at Haya Nature Resort."}
        </p>

        <button
          type="button"
          className="choose-room-details-link"
          onClick={onViewDetails}
          aria-expanded={false}
        >
          {showDetails ? "Hide details" : "View details"}
          <span>{showDetails ? "−" : "+"}</span>
        </button>

        <div className="choose-room-offer-row">
          <div className="choose-room-offer-copy">
            <strong>Seasonal Discount (Friday to Saturday)</strong>
            <button
              type="button"
              className="choose-room-view-offers"
              onClick={() => setShowOffers((previous) => !previous)}
              aria-expanded={showOffers}
            >
              {showOffers ? "Hide offers" : "View offers"}{" "}
              <span>{showOffers ? "⌃" : "›"}</span>
            </button>
          </div>
        </div>

        {showOffers && (
          <div className="choose-room-offer-details">
            Special offer price shown below. The original price is displayed for
            comparison.
          </div>
        )}

        <div className="choose-room-card-footer">
          <div className="choose-room-price">
            {roomPricing && (
              <span className="choose-room-original-price">
                {formatPrice(roomPricing.original)}
              </span>
            )}
            <strong>
              {price == null ? "Contact resort" : formatPrice(price)}
            </strong>
            <span>
              {nights > 0
                ? `${nights} night${nights === 1 ? "" : "s"}`
                : "1 Night · Per night"}
            </span>
          </div>

          <button
            type="button"
            className={`choose-room-add-button ${selected ? "is-selected" : ""}`}
            onClick={onAdd}
          >
            {selected ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ChooseRoom;
