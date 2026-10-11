import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

const API_URL = "https://haya-resort.onrender.com/api";

const EMPTY_SETTINGS = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  paymentInstructions: "",
};

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const reservation = location.state || {};
  const rooms = Array.isArray(reservation.rooms) ? reservation.rooms : [];
  const guest = reservation.guest || {};

  const checkIn = reservation.checkIn || "";
  const checkOut = reservation.checkOut || "";

  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");

  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentSlip, setPaymentSlip] = useState(null);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(`${checkIn}T00:00:00Z`);
    const end = new Date(`${checkOut}T00:00:00Z`);

    return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const formatDate = (value) => {
    if (!value) return "Not selected";

    const date = new Date(`${value}T12:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const getRoomName = (room) =>
    room.name ||
    room.room_name ||
    room.title ||
    room.room_type ||
    "Resort accommodation";

  const getRoomId = (room) => room.id ?? room.room_id;

  const getNightlyPrice = (room) => {
    const candidates = [
      room.price_per_night,
      room.pricePerNight,
      room.price,
      room.room_price,
      room.rate,
      room.nightly_rate,
      room.nightlyRate,
    ];

    for (const candidate of candidates) {
      if (
        candidate !== undefined &&
        candidate !== null &&
        candidate !== "" &&
        Number.isFinite(Number(candidate)) &&
        Number(candidate) > 0
      ) {
        return Number(candidate);
      }
    }

    // If the selected room has no price but a valid subtotal exists,
    // estimate its nightly price from the subtotal.
    if (rooms.length === 1 && nights > 0) {
      const subtotal = Number(reservation.subtotal);

      if (Number.isFinite(subtotal) && subtotal > 0) {
        return subtotal / nights;
      }
    }

    return 0;
  };

  const estimatedSubtotal = useMemo(() => {
    const suppliedSubtotal = Number(reservation.subtotal);

    if (Number.isFinite(suppliedSubtotal) && suppliedSubtotal > 0) {
      return suppliedSubtotal;
    }

    return rooms.reduce(
      (total, room) => total + getNightlyPrice(room) * nights,
      0,
    );
  }, [reservation.subtotal, rooms, nights]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPaymentSettings() {
      setSettingsLoading(true);
      setSettingsError("");

      try {
        const response = await fetch(`${API_URL}/settings/payment`, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            "The payment settings API returned a non-JSON response. Check that the backend is running on port 5000.",
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load payment details.");
        }

        const rawSettings = data.settings || data;

        const normalizedSettings = {
          bankName: rawSettings.bankName || rawSettings.bank_name || "",
          accountName:
            rawSettings.accountName || rawSettings.account_name || "",
          accountNumber:
            rawSettings.accountNumber || rawSettings.account_number || "",
          paymentInstructions:
            rawSettings.paymentInstructions ||
            rawSettings.payment_instructions ||
            "",
        };

        if (!cancelled) {
          setSettings(normalizedSettings);

          if (
            !normalizedSettings.bankName ||
            !normalizedSettings.accountName ||
            !normalizedSettings.accountNumber
          ) {
            setSettingsError(
              "The server responded, but one or more bank details are empty. Confirm that the admin settings were saved to the same database used by this backend.",
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setSettingsError(err.message || "Unable to load payment details.");
        }
      } finally {
        if (!cancelled) {
          setSettingsLoading(false);
        }
      }
    }

    fetchPaymentSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setPaymentSlip(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Upload a JPG, PNG, WEBP, or PDF payment slip.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your payment slip must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setPaymentSlip(file);
  };

  const validateReservation = () => {
    if (!rooms.length) {
      return "No rooms were selected. Please return to room selection.";
    }

    if (
      rooms.some(
        (room) =>
          !Number.isInteger(Number(getRoomId(room))) ||
          Number(getRoomId(room)) <= 0,
      )
    ) {
      return "One or more selected rooms have invalid room IDs. Please select your rooms again.";
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return "Your check-in or check-out dates are invalid.";
    }

    if (nights < 1) {
      return "Your stay must be at least one night.";
    }

    if (
      !guest.firstName?.trim() ||
      !guest.lastName?.trim() ||
      !guest.email?.trim() ||
      !guest.phone?.trim()
    ) {
      return "Guest information is incomplete. Please return to the guest details page.";
    }

    return "";
  };

  const readJsonResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(
        "The server returned HTML instead of JSON. Check the API URL and backend routes.",
      );
    }

    return response.json();
  };

  const handleCompleteBooking = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(null);

    const validationError = validateReservation();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!acceptedTerms) {
      setError("Please read and accept the Terms & Conditions.");
      return;
    }

    if (!paymentReference.trim()) {
      setError("Please enter your bank transfer payment reference.");
      return;
    }

    if (!paymentDate) {
      setError("Please select your payment date.");
      return;
    }

    if (!paymentSlip) {
      setError("Please upload your payment slip.");
      return;
    }

    if (
      !settings.bankName ||
      !settings.accountName ||
      !settings.accountNumber
    ) {
      setError(
        "Payment account details are incomplete. Please contact the resort before proceeding.",
      );
      return;
    }

    setSubmitting(true);

    try {
      let confirmedBooking = bookingResult;

      if (!confirmedBooking) {
        const bookingPayload = {
          roomIds: rooms.map((room) => Number(getRoomId(room))),
          checkIn,
          checkOut,
          guests: 1,
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          email: guest.email.trim(),
          phone: guest.phone.trim(),
          specialRequests: guest.specialRequests?.trim() || "",
        };

        const bookingResponse = await fetch(`${API_URL}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(bookingPayload),
        });

        const bookingData = await readJsonResponse(bookingResponse);

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData.message || "Unable to create your booking.",
          );
        }

        if (!bookingData.booking?.id) {
          throw new Error(
            "The server did not return a booking ID. Check the booking controller response.",
          );
        }

        confirmedBooking = bookingData.booking;
        setBookingResult(confirmedBooking);
      }

      const paymentAmount = Number(confirmedBooking.total_amount);

      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        throw new Error(
          "The server returned an invalid booking total. Check the room prices in your database.",
        );
      }

      const paymentForm = new FormData();

      paymentForm.append("bookingId", String(confirmedBooking.id));
      paymentForm.append("amount", String(paymentAmount));
      paymentForm.append("paymentReference", paymentReference.trim());
      paymentForm.append("paymentDate", paymentDate);
      paymentForm.append("paymentMethod", "bank_transfer");
      paymentForm.append("paymentSlip", paymentSlip);

      const paymentResponse = await fetch(`${API_URL}/payments`, {
        method: "POST",
        body: paymentForm,
      });

      const paymentData = await readJsonResponse(paymentResponse);

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            "Your booking was created, but payment submission failed.",
        );
      }

      setSuccess({
        bookingReference: confirmedBooking.booking_reference,
        bookingId: confirmedBooking.id,
        paymentId: paymentData.payment?.id || null,
        amount: paymentAmount,
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="haya-booking-page">
        <header className="haya-booking-header">
          <div className="haya-booking-brand">
            <span className="haya-booking-brand-mark">H</span>
            <span>
              <strong>HAYA</strong>
              <small>NATURE RESORT</small>
            </span>
          </div>
        </header>

        <section className="haya-success-card">
          <div className="haya-success-icon">✓</div>

          <p className="haya-booking-eyebrow">RESERVATION RECEIVED</p>

          <h1>Thank you for choosing Haya.</h1>

          <p>
            Your booking and payment slip have been submitted successfully. The
            resort will review your payment before confirming your reservation.
          </p>

          <div className="haya-success-reference">
            <span>Booking reference</span>
            <strong>{success.bookingReference}</strong>
          </div>

          <div className="haya-success-total">
            <span>Booking total</span>
            <strong>{formatPrice(success.amount)}</strong>
          </div>

          <div className="haya-success-notice">
            Your payment is awaiting review. Please keep your booking reference
            for future communication with the resort.
          </div>

          <button
            type="button"
            className="haya-booking-primary"
            onClick={() => navigate("/")}
          >
            Return to homepage
          </button>
        </section>

        <footer className="haya-booking-footer">
          HAYA NATURE RESORT · Thoughtful stays, closer to nature.
        </footer>
      </main>
    );
  }

  return (
    <main className="haya-booking-page">
      <header className="haya-booking-header">
        <button
          type="button"
          className="haya-booking-back"
          onClick={() =>
            navigate("/guest-details", {
              state: reservation,
            })
          }
        >
          ← Back
        </button>

        <div className="haya-booking-brand">
          <span className="haya-booking-brand-mark">H</span>
          <span>
            <strong>HAYA</strong>
            <small>NATURE RESORT</small>
          </span>
        </div>

        <div className="haya-booking-secure">
          <span>♧</span> Secure booking
        </div>
      </header>

      <section className="haya-booking-hero">
        <p className="haya-booking-eyebrow">YOUR STAY, YOUR WAY</p>

        <h1>Review & complete your booking</h1>

        <p>
          Review your reservation, transfer your payment, and upload your
          payment confirmation.
        </p>

        <div className="haya-booking-progress">
          <span className="is-complete">
            <b>✓</b> Choose room
          </span>

          <i />

          <span className="is-complete">
            <b>✓</b> Guest details
          </span>

          <i />

          <span className="is-active">
            <b>3</b> Payment
          </span>
        </div>
      </section>

      <form className="haya-booking-layout" onSubmit={handleCompleteBooking}>
        <div className="haya-booking-main">
          {error && (
            <div className="haya-booking-alert" role="alert">
              <strong>Unable to continue</strong>
              <p>{error}</p>
            </div>
          )}

          {bookingResult && (
            <div className="haya-booking-notice">
              Your booking reference is{" "}
              <strong>{bookingResult.booking_reference}</strong>. Your payment
              has not yet been submitted. You can retry the payment submission
              below.
            </div>
          )}

          <section className="haya-booking-card">
            <div className="haya-booking-card-heading">
              <div>
                <p className="haya-booking-eyebrow">STEP 01</p>
                <h2>Guest information</h2>
              </div>

              <span className="haya-booking-card-icon">♙</span>
            </div>

            <div className="haya-booking-guest-grid">
              <div>
                <small>FULL NAME</small>
                <strong>
                  {guest.firstName} {guest.lastName}
                </strong>
              </div>

              <div>
                <small>EMAIL ADDRESS</small>
                <strong>{guest.email}</strong>
              </div>

              <div>
                <small>PHONE NUMBER</small>
                <strong>{guest.phone}</strong>
              </div>

              <div>
                <small>COUNTRY</small>
                <strong>{guest.country || "Not provided"}</strong>
              </div>
            </div>

            {guest.specialRequests && (
              <div className="haya-booking-special-request">
                <small>SPECIAL REQUESTS</small>
                <p>{guest.specialRequests}</p>
              </div>
            )}
          </section>

          <section className="haya-booking-card">
            <div className="haya-booking-card-heading">
              <div>
                <p className="haya-booking-eyebrow">STEP 02</p>
                <h2>Bank transfer details</h2>
                <p>Transfer the booking amount to the account below.</p>
              </div>

              <span className="haya-booking-card-icon">₱</span>
            </div>

            {settingsLoading ? (
              <div className="haya-booking-loading">
                Loading payment details...
              </div>
            ) : (
              <>
                {settingsError && (
                  <div className="haya-booking-alert" role="alert">
                    <p>{settingsError}</p>

                    <button
                      type="button"
                      className="haya-booking-text-button"
                      onClick={() => window.location.reload()}
                    >
                      Try again
                    </button>
                  </div>
                )}

                <div className="haya-bank-details">
                  <div className="haya-bank-detail">
                    <span>Bank name</span>
                    <strong>{settings.bankName || "Not configured"}</strong>
                  </div>

                  <div className="haya-bank-detail">
                    <span>Account name</span>
                    <strong>{settings.accountName || "Not configured"}</strong>
                  </div>

                  <div className="haya-bank-detail haya-account-number">
                    <span>Account number</span>
                    <strong>
                      {settings.accountNumber || "Not configured"}
                    </strong>

                    {settings.accountNumber && (
                      <button
                        type="button"
                        className="haya-booking-copy-button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              settings.accountNumber,
                            );
                          } catch {
                            setError(
                              "Unable to copy the account number. Please copy it manually.",
                            );
                          }
                        }}
                      >
                        Copy account number
                      </button>
                    )}
                  </div>
                </div>

                {settings.paymentInstructions && (
                  <div className="haya-payment-instructions">
                    <strong>Payment instructions</strong>
                    <p>{settings.paymentInstructions}</p>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="haya-booking-card">
            <div className="haya-booking-card-heading">
              <div>
                <p className="haya-booking-eyebrow">STEP 03</p>
                <h2>Payment confirmation</h2>
                <p>Enter the transfer details and upload your payment slip.</p>
              </div>

              <span className="haya-booking-card-icon">↥</span>
            </div>

            <div className="haya-payment-fields">
              <label>
                Payment reference <b>*</b>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(event) => setPaymentReference(event.target.value)}
                  placeholder="Enter your transfer reference"
                  required
                  disabled={submitting}
                />
              </label>

              <label>
                Payment date <b>*</b>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  required
                  disabled={submitting}
                />
              </label>

              <label className="haya-payment-upload">
                Payment slip <b>*</b>
                <span className="haya-upload-area">
                  <span className="haya-upload-icon">↑</span>

                  <strong>
                    {paymentSlip
                      ? paymentSlip.name
                      : "Choose your payment slip"}
                  </strong>

                  <small>JPG, PNG, WEBP or PDF · Maximum 5 MB</small>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleSlipChange}
                    required
                    disabled={submitting}
                  />
                </span>
              </label>
            </div>

            <div className="haya-payment-review-note">
              Your payment will remain pending until the resort verifies the
              transfer. Uploading a slip does not automatically confirm your
              reservation.
            </div>
          </section>

          <section className="haya-booking-card haya-terms-card">
            <div className="haya-booking-card-heading">
              <div>
                <p className="haya-booking-eyebrow">STEP 04</p>
                <h2>Terms & Conditions</h2>
              </div>

              <span className="haya-booking-card-icon">§</span>
            </div>

            <p className="haya-terms-intro">
              Please review the booking terms before completing your
              reservation.
            </p>

            <button
              type="button"
              className="haya-booking-terms-button"
              onClick={() => setShowTerms(true)}
            >
              Read Terms & Conditions
              <span>↗</span>
            </button>

            <label className="haya-terms-checkbox">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                disabled={submitting}
              />

              <span>
                I have read and agree to the Terms & Conditions.
                <b>*</b>
              </span>
            </label>
          </section>
        </div>

        <aside className="haya-booking-sidebar">
          <div className="haya-booking-summary-card">
            <p className="haya-booking-eyebrow">YOUR RESERVATION</p>

            <h2>Stay summary</h2>

            <p className="haya-booking-location">
              Haya Nature Resort · Botolan, Zambales
            </p>

            <div className="haya-summary-dates">
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

            <div className="haya-summary-count">
              {nights} night{nights === 1 ? "" : "s"} · {rooms.length} room
              {rooms.length === 1 ? "" : "s"}
            </div>

            <div className="haya-summary-room-list">
              {rooms.map((room, index) => (
                <div
                  className="haya-summary-room"
                  key={getRoomId(room) ?? index}
                >
                  <div className="haya-summary-room-icon">▱</div>

                  <div className="haya-summary-room-info">
                    <strong>{getRoomName(room)}</strong>
                    <small>{formatPrice(getNightlyPrice(room))} / night</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="haya-summary-price-row">
              <span>Estimated room subtotal</span>
              <strong>{formatPrice(estimatedSubtotal)}</strong>
            </div>

            {bookingResult && (
              <>
                <div className="haya-summary-price-row">
                  <span>Booking reference</span>
                  <strong>{bookingResult.booking_reference}</strong>
                </div>

                <div className="haya-summary-total">
                  <span>Database booking total</span>
                  <strong>{formatPrice(bookingResult.total_amount)}</strong>
                </div>
              </>
            )}

            <p className="haya-summary-note">
              Final room prices are calculated by the resort booking system. Any
              applicable taxes or additional fees must be confirmed by the
              resort.
            </p>

            <button
              type="submit"
              className="haya-booking-primary"
              disabled={
                submitting ||
                settingsLoading ||
                Boolean(settingsError) ||
                !settings.bankName ||
                !settings.accountName ||
                !settings.accountNumber
              }
            >
              {submitting
                ? "Submitting your booking..."
                : bookingResult
                  ? "Submit Payment"
                  : "Confirm & Complete Booking"}

              {!submitting && <span>→</span>}
            </button>

            <p className="haya-summary-secure">
              ♧ Your payment slip will be submitted securely for review.
            </p>
          </div>
        </aside>
      </form>

      <footer className="haya-booking-footer">
        <span>HAYA NATURE RESORT</span>
        <span>Thoughtful stays, closer to nature.</span>
      </footer>

      {showTerms && (
        <div
          className="haya-terms-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowTerms(false);
            }
          }}
        >
          <section
            className="haya-terms-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="haya-terms-title"
          >
            <header className="haya-terms-modal-header">
              <div>
                <p className="haya-booking-eyebrow">PLEASE READ CAREFULLY</p>
                <h2 id="haya-terms-title">Terms & Conditions</h2>
              </div>

              <button
                type="button"
                className="haya-terms-close"
                onClick={() => setShowTerms(false)}
                aria-label="Close Terms and Conditions"
              >
                ×
              </button>
            </header>

            <div className="haya-terms-scroll">
              <h3>1. Reservations</h3>
              <p>
                All reservations are subject to room availability and review by
                Haya Nature Resort. Submitting a booking request does not mean
                the reservation is confirmed.
              </p>

              <h3>2. Payment</h3>
              <p>
                Guests must transfer the applicable booking amount using the
                payment details provided by the resort. A payment reference and
                readable proof of payment must be submitted where requested.
              </p>

              <h3>3. Payment verification</h3>
              <p>
                Payments are subject to verification by the resort. Uploading a
                payment slip does not guarantee confirmation. The resort may
                contact the guest if further information is required.
              </p>

              <h3>4. Check-in and check-out</h3>
              <p>
                Guests should follow the check-in and check-out times
                communicated by the resort. Any request for an early check-in or
                late check-out is subject to availability and resort approval.
              </p>

              <h3>5. Guest information</h3>
              <p>
                Guests are responsible for providing accurate contact details,
                stay dates, and other required reservation information.
              </p>

              <h3>6. Changes and cancellations</h3>
              <p>
                Changes, cancellations, refunds, and related charges must be
                handled according to the resort's applicable policies. Please
                contact the resort to confirm the policy that applies to your
                reservation.
              </p>

              <h3>7. Resort policies</h3>
              <p>
                Guests are expected to follow the resort's safety, property-use,
                and conduct rules throughout their stay.
              </p>

              <h3>8. Contact</h3>
              <p>
                If you have questions about your reservation or payment, contact
                the resort before submitting your payment.
              </p>

              <div className="haya-terms-draft-note">
                Important: These are starter terms for the website. The resort
                owner should review and approve the final cancellation, refund,
                deposit, and other policies before the website goes live.
              </div>
            </div>

            <footer className="haya-terms-modal-footer">
              <button
                type="button"
                className="haya-booking-secondary"
                onClick={() => setShowTerms(false)}
              >
                Close
              </button>

              <button
                type="button"
                className="haya-booking-primary"
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTerms(false);
                }}
              >
                Accept Terms
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

export default Booking;
