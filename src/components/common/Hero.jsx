import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__image-wrapper">
        <img src={heroImage} alt="Haya Resort" className="hero__image" />
      </div>

      <div className="hero__overlay" />

      <div className="hero__content">
        <motion.p
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          HAYA RESORT
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          Welcome to Haya
        </motion.h1>

        <motion.p
          className="hero__description"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A tranquil escape where nature, comfort and unforgettable experiences
          come together.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <Link to="/booking" className="hero__button hero__button--primary">
            Book Your Stay
          </Link>

          <Link to="/rooms" className="hero__button hero__button--outline">
            Explore Rooms
          </Link>
        </motion.div>
      </div>

      <div className="hero__scroll">
        <span>Scroll to explore</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}

export default Hero;
