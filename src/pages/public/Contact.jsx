import React, { useState } from "react";
import "./Contact.css";

const API_URL = "http://localhost:5000/api";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  /* =========================================
     HANDLE INPUT CHANGES
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (feedback.message) {
      setFeedback({
        type: "",
        message: "",
      });
    }
  };

  /* =========================================
     SUBMIT CONTACT MESSAGE
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setFeedback({
      type: "",
      message: "",
    });

    const name = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !phone || !email || !message) {
      setFeedback({
        type: "error",
        message: "Please complete all required fields.",
      });

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          phone,
          email,
          subject: "Website Contact Us Inquiry",
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your message.");
      }

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });

      setFeedback({
        type: "success",
        message:
          "Thank you for contacting Haya Resort! Your message has been received. Our team will get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);

      setFeedback({
        type: "error",
        message:
          error.message ||
          "We couldn't send your message. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================
     CONTACT PAGE
  ========================================= */

  return (
    <main className="haya-contact">
      {/* PAGE HEADING */}

      <section className="haya-contact-heading">
        <h1>CONTACT US</h1>
      </section>

      <section className="haya-contact-content">
        {/* =====================================
            CONTACT OFFICE INFORMATION
        ===================================== */}

        <div className="haya-contact-offices">
          {/* MANILA SALES / RESERVATIONS OFFICE */}

          <article className="haya-contact-office">
            <h2>MANILA SALES / RESERVATIONS OFFICE</h2>

            <div className="haya-contact-icon" aria-hidden="true">
              ♧
            </div>

            <div className="haya-contact-schedule">
              <div>
                <h3>Monday to Friday</h3>
                <p>8:00 AM – 4:30 PM</p>
              </div>

              <div>
                <h3>Saturday</h3>
                <p>7:30 AM – 3:30 PM</p>
              </div>
            </div>

            <a className="haya-contact-phone" href="tel:09989617487">
              +639756637195
            </a>
          </article>

          {/* FRONT OFFICE */}

          <article className="haya-contact-office">
            <h2>FRONT OFFICE</h2>

            <div className="haya-contact-icon" aria-hidden="true">
              ♧
            </div>

            <div className="haya-contact-schedule">
              <div>
                <h3>Monday to Sunday</h3>
                <p>7:00 AM – 10:00 PM</p>
              </div>
            </div>

            <a className="haya-contact-phone" href="tel:09338287166">
              +639756637195
            </a>
          </article>
        </div>

        {/* =====================================
            CONTACT FORM INTRODUCTION
        ===================================== */}

        <section className="haya-contact-form-section">
          <div className="haya-contact-form-intro">
            <h2>Got any inquiries, comments, or recommendations?</h2>

            <p>
              Feel free to reach out and message us, we would love to hear from
              you!
            </p>
          </div>

          {/* =====================================
              CONTACT FORM
          ===================================== */}

          <form className="haya-contact-form" onSubmit={handleSubmit}>
            {/* FULL NAME */}

            <div className="haya-contact-field">
              <label htmlFor="contact-full-name">Full Name *</label>

              <input
                id="contact-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={150}
              />
            </div>

            {/* PHONE */}

            <div className="haya-contact-field">
              <label htmlFor="contact-phone">Phone *</label>

              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                maxLength={30}
              />
            </div>

            {/* EMAIL */}

            <div className="haya-contact-field">
              <label htmlFor="contact-email">Email *</label>

              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                maxLength={254}
              />
            </div>

            {/* MESSAGE */}

            <div className="haya-contact-field">
              <label htmlFor="contact-message">Message *</label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={6}
                required
                maxLength={5000}
              />
            </div>

            {/* SUCCESS OR ERROR FEEDBACK */}

            {feedback.message && (
              <div
                className={`haya-contact-feedback ${feedback.type}`}
                role={feedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {feedback.message}
              </div>
            )}

            {/* SUBMIT BUTTON */}

            <button
              className="haya-contact-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Contact;
