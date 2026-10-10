import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./RoomsSection.css";

const rooms = [
  {
    name: "Meria Standard",
    slug: "meria-standard",
    description:
      "A comfortable and peaceful space designed for a relaxing stay.",
    image: "/images/meria-standard.jpg",
  },
  {
    name: "Kala Standard",
    slug: "kala-standard",
    description:
      "A beautifully appointed room surrounded by the natural atmosphere of Haya.",
    image: "/images/kala-standard.jpg",
  },
  {
    name: "Kala Deluxe",
    slug: "kala-deluxe",
    description:
      "Enjoy additional comfort and space in our elegant deluxe accommodation.",
    image: "/images/kala-deluxe.jpg",
  },
  {
    name: "Yasmin Deluxe",
    slug: "yasmin-deluxe",
    description:
      "A refined retreat combining comfort, privacy and the beauty of nature.",
    image: "/images/yasmin-deluxe.jpg",
  },
  {
    name: "Villa Frangipani",
    slug: "villa-frangipani",
    description:
      "Experience a private villa stay surrounded by a tranquil natural setting.",
    image: "/images/villa-frangipani.jpg",
  },
  {
    name: "Allo Villa",
    slug: "allo-villa",
    description:
      "A spacious villa created for memorable stays with family and friends.",
    image: "/images/allo-villa.jpg",
  },
  {
    name: "Sola Villa",
    slug: "sola-villa",
    description:
      "A serene private escape where comfort meets the beauty of Haya.",
    image: "/images/sola-villa.jpg",
  },
];

function RoomsSection() {
  return (
    <section className="rooms-section">
      <div className="rooms-section__intro">
        <motion.p
          className="rooms-section__eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          STAY AT HAYA
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Find your perfect retreat
        </motion.h2>
      </div>

      <div className="rooms-section__grid">
        {rooms.map((room, index) => (
          <motion.article
            className="room-card"
            key={room.slug}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
          >
            <Link to={`/rooms/${room.slug}`} className="room-card__image-link">
              <div className="room-card__image-wrapper">
                <img
                  src={room.image}
                  alt={room.name}
                  className="room-card__image"
                />
              </div>
            </Link>

            <div className="room-card__content">
              <p className="room-card__number">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3>{room.name}</h3>

              <p className="room-card__description">{room.description}</p>

              <Link to={`/rooms/${room.slug}`} className="room-card__link">
                View accommodation
                <span>↗</span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="rooms-section__button-wrapper">
        <Link to="/rooms" className="rooms-section__button">
          View all rooms
        </Link>
      </div>
    </section>
  );
}

export default RoomsSection;
