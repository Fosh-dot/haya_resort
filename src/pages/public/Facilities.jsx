import "./Facilities.css";

import poolImage from "../../assets/haya/Facilities/pool.jpg";
import toiletImage from "../../assets/haya/Facilities/toilet.jpg";
import activitiesImage from "../../assets/haya/Facilities/activities.jpg";
import beachImage from "../../assets/haya/Facilities/beach.jpg";
import restaurantImage from "../../assets/haya/Facilities/restaurant.jpg";

const facilities = [
  {
    title: "ADULTS & KIDS\nSWIMMING POOL",
    image: poolImage,
    alt: "Adults and kids swimming pool",
  },
  {
    title: "COMMON\nTOILET AND BATHROOM",
    image: toiletImage,
    alt: "Common toilet and bathroom",
  },
  {
    title: "OUTDOOR\nPLAYGROUND",
    image: activitiesImage,
    alt: "Outdoor playground",
  },
  {
    title: "BEACH",
    image: beachImage,
    alt: "Haya Nature Resort beach",
  },
  {
    title: "CABAÑA\nCOMMON KITCHEN",
    image: restaurantImage,
    alt: "Resort common kitchen",
  },
  {
    title: "BIRD'S NEST RESTAURANT",
    image: restaurantImage,
    alt: "Bird's Nest Restaurant",
  },
];

function Facilities() {
  return (
    <main className="facilities-page">
      <h1 className="facilities-page__title">FACILITIES</h1>

      <section className="facilities-grid" aria-label="Resort facilities">
        {facilities.map((facility) => (
          <article className="facility-card" key={facility.title}>
            <div className="facility-card__image-wrapper">
              <img
                src={facility.image}
                alt={facility.alt}
                className="facility-card__image"
              />
            </div>

            <h2 className="facility-card__title">
              {facility.title.split("\n").map((line, index) => (
                <span key={`${facility.title}-${index}`}>{line}</span>
              ))}
            </h2>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Facilities;
