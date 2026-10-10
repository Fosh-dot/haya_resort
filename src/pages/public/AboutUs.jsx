import "./AboutUs.css";

function AboutUs() {
  return (
    <main className="about-us-page">
      <section className="about-us-intro">
        <h1>WHO IS HAYA NATURE RESORT?</h1>

        <p>
          A nature resort where Guests can experience and appreciate nature, and
          be inspired to take personal action in nurturing and preserving it.
        </p>
      </section>

      <section className="about-us-values">
        <article className="about-us-value">
          <h2>VISION</h2>

          <p>
            Our vision is to have a world where people can experience the
            serenity of nature.
          </p>
        </article>

        <article className="about-us-value">
          <h2>MISSION</h2>

          <p>
            We are stewards of nature delivering impressive guest experience for
            them to enjoy its serenity.
          </p>
        </article>
      </section>
    </main>
  );
}

export default AboutUs;
