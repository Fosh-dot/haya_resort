import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookNow.css";

function BookNow() {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSearch = (event) => {
    event.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select your check-in and check-out dates.");
      return;
    }

    if (checkIn < todayString) {
      setError("Check-in cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    navigate("/choose-room", {
      state: {
        checkIn,
        checkOut,
      },
    });
  };

  return (
    <main className="book-now-page">
      <div className="booking-notice">
        IT IS THE RESPONSIBILITY OF THE GUEST TO READ AND UNDERSTAND THE TERMS
        AND CONDITIONS BEFORE PAYING THE RESERVATION.
      </div>

      <section className="book-now-content">
        <form className="book-now-form" onSubmit={handleSearch}>
          <div className="book-now-field">
            <label htmlFor="check-in">Check In:</label>

            <input
              id="check-in"
              type="date"
              min={todayString}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="book-now-field">
            <label htmlFor="check-out">Check Out:</label>

            <input
              id="check-out"
              type="date"
              min={checkIn || todayString}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setError("");
              }}
              required
            />
          </div>

          <button className="book-now-go" type="submit">
            GO
          </button>
        </form>

        {error && (
          <p className="book-now-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default BookNow;
