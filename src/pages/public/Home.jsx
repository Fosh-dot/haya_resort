import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";

import heroVideo from "../../assets/haya/hero/haya-hero.mp4";

function Home() {
  const location = useLocation();

  const showWelcome = location.pathname === "/";

  useEffect(() => {
    document.title =
      location.pathname === "/" ? "Home | Haya Resort" : "Home | Haya Resort";
  }, [location.pathname]);

  return (
    <main className="haya-home">
      {/* WELCOME SCREEN — KEEPING THE EXISTING VIDEO */}
      {showWelcome ? (
        <section className="haya-welcome">
          <video
            className="haya-welcome-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          <div className="haya-welcome-overlay" />

          <div className="haya-welcome-content">
            <h1>WELCOME TO NATURE</h1>

            <p>
              Haya is a nature resort where you can experience and appreciate
              nature, and be inspired to take personal action in nurturing and
              preserving it.
            </p>
          </div>
        </section>
      ) : (
        <section className="haya-home-video">
          <video
            className="haya-home-video-player"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Haya Nature Resort"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </section>
      )}
    </main>
  );
}

export default Home;
