import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { rooms } from "./Rooms";

import descriptionImage from "../../assets/haya/rooms/description.png";
import descriptionImage2 from "../../assets/haya/rooms/description2.png";
import descriptionImage3 from "../../assets/haya/rooms/description3.png";
import descriptionImage4 from "../../assets/haya/rooms/description4.png";
import descriptionImage5 from "../../assets/haya/rooms/description5.png";
import descriptionImage6 from "../../assets/haya/rooms/description6.png";
import descriptionImage7 from "../../assets/haya/rooms/description7.png";

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

import "./RoomDetails.css";

const normalizeSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function RoomDetails() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  // Match using the room ID first, then fall back to its name.
  const room = rooms.find(
    (item) =>
      normalizeSlug(item.id) === normalizeSlug(id) ||
      normalizeSlug(item.name) === normalizeSlug(id),
  );

  const galleryImages = {
    "meria-standard": [room?.image, meriaImage2, meriaImage3].filter(Boolean),

    "kala-standard": [kalaStandardImage2, kalaStandardImage, meriaImage3],

    "kala-deluxe": [kalaDeluxeImage, kalaDeluxeImage2, kalaDeluxeImage3],

    "yasmin-deluxe": [yasminDeluxeImage, yasminDeluxeImage2, kalaDeluxeImage3],

    "villa-frangipani": [
      villaFrangipaniImage,
      villaFrangipaniImage2,
      kalaDeluxeImage3,
    ],

    "allo-villa": [
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

    "sola-villa": [
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
  };

  const descriptionImages = {
    "meria-standard": descriptionImage,
    "kala-standard": descriptionImage2,
    "kala-deluxe": descriptionImage3,
    "yasmin-deluxe": descriptionImage4,
    "villa-frangipani": descriptionImage5,
    "allo-villa": descriptionImage6,
    "sola-villa": descriptionImage7,
  };

  const roomKey = normalizeSlug(room?.id || id);

  const images = galleryImages[roomKey] || (room?.image ? [room.image] : []);

  const description = descriptionImages[roomKey];

  useEffect(() => {
    setCurrentImage(0);
  }, [id]);

  const previousImage = () => {
    setCurrentImage((previous) =>
      previous === 0 ? images.length - 1 : previous - 1,
    );
  };

  const nextImage = () => {
    setCurrentImage((previous) =>
      previous === images.length - 1 ? 0 : previous + 1,
    );
  };

  if (!room) {
    return (
      <main className="room-details-page">
        <div className="room-not-found">
          <h1>Room Not Found</h1>
          <p>
            We could not find a room matching "{id}". Please check the room
            listing and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="room-details-page">
      {images.length > 0 && (
        <section
          className="room-details-gallery"
          aria-label={`${room.name} photo gallery`}
        >
          <div className="room-details-gallery-main">
            <img
              src={images[currentImage]}
              alt={`${room.name} - Photo ${currentImage + 1}`}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="room-gallery-arrow room-gallery-previous"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>

                <button
                  type="button"
                  className="room-gallery-arrow room-gallery-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#10095;
                </button>

                <span className="room-gallery-counter">
                  {currentImage + 1}/{images.length}
                </span>
              </>
            )}
          </div>
        </section>
      )}

      <section className="room-details-information">
        <h1>{room.name}</h1>

        <p className="room-details-capacity">{room.capacity} Persons</p>

        {description && (
          <div className="room-description-image">
            <img src={description} alt={`${room.name} description`} />
          </div>
        )}
      </section>
    </main>
  );
}

export default RoomDetails;
