import { Link } from "react-router-dom";
import "./Rooms.css";

import meriaImage from "../../assets/haya/rooms/meria-standard.jpg";
import kalaStandardImage from "../../assets/haya/rooms/kala-standard.jpg";
import kalaDeluxeImage from "../../assets/haya/rooms/kala-deluxe.jpg";
import yasminImage from "../../assets/haya/rooms/yasmin-deluxe.jpg";
import frangipaniImage from "../../assets/haya/rooms/villa-frangipani.jpg";
import alloImage from "../../assets/haya/rooms/allo-villa9.jpg";
import solaImage from "../../assets/haya/rooms/sola-villa12.jpg";

import ResortMap from "../../components/common/ResortMap";

export const rooms = [
  {
    id: "meria-standard",
    name: "MERIA STANDARD",
    capacity: 3,
    image: meriaImage,
    description:
      "Comfortable accommodation designed for a relaxing stay at Haya Nature Resort.",
  },
  {
    id: "kala-standard",
    name: "KALA STANDARD",
    capacity: 4,
    image: kalaStandardImage,
    description:
      "A welcoming room designed for guests looking to relax and enjoy nature.",
  },
  {
    id: "kala-deluxe",
    name: "KALA DELUXE",
    capacity: 5,
    image: kalaDeluxeImage,
    description:
      "A comfortable deluxe room for a peaceful and memorable resort experience.",
  },
  {
    id: "yasmin-deluxe",
    name: "YASMIN DELUXE",
    capacity: 6,
    image: yasminImage,
    description:
      "A thoughtfully designed deluxe room for a comfortable getaway.",
  },
  {
    id: "villa-frangipani",
    name: "VILLA FRANGIPANI",
    capacity: 8,
    image: frangipaniImage,
    description: "A spacious villa designed for families and small groups.",
  },
  {
    id: "allo-villa",
    name: "ALLO VILLA",
    capacity: 15,
    image: alloImage,
    description:
      "A villa ideal for larger families and groups seeking a relaxing escape.",
  },
  {
    id: "sola-villa",
    name: "SOLA VILLA",
    capacity: 10,
    image: solaImage,
    description:
      "A private villa offering space to unwind and enjoy your stay.",
  },
];

function Rooms() {
  return (
    <div className="rooms-page">
      <section className="rooms-intro">
        <h1>ROOMS AT HAYA</h1>

        <p>
          Our rooms were designed with your needs in mind. Comfortable and with
          a bit of personality, each one of our rooms will make your stay at
          Haya Nature Resort relaxing.
        </p>

        <p className="rooms-rate-note">
          Room rates can be seen on <Link to="/book-now">‘Book Now’</Link> page.
        </p>
      </section>

      <section className="rooms-grid" aria-label="Available rooms and villas">
        {rooms.map((room) => (
          <article className="room-card" key={room.id}>
            <Link
              to={`/rooms/${room.id}`}
              className="room-card-image-link"
              aria-label={`View ${room.name} details`}
            >
              <img
                className="room-card-image"
                src={room.image}
                alt={room.name}
                loading="lazy"
              />
            </Link>

            <div className="room-card-info">
              <h2>{room.name}</h2>

              <p>
                Ideal for {room.capacity}{" "}
                {room.capacity === 1 ? "person" : "persons"}
              </p>

              <Link className="room-details-button" to={`/rooms/${room.id}`}>
                More details
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="rooms-map-section" aria-label="Resort map">
        <ResortMap />
      </section>
    </div>
  );
}

export default Rooms;
