import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import poolImage from "../../assets/haya/facilities/pool.jpg";
import eventImage from "../../assets/haya/events/event-11.jpg";
import activitiesImage from "../../assets/haya/facilities/activities.jpg";

import "./ExperienceSection.css";

const experiences = [
  {
    title: "Facilities",
    description:
      "We offer a wide range of indoor and outdoor facilities that can make your stay in Haya Nature Resort more memorable.",
    image: poolImage,
    path: "/facilities",
  },
  {
    title: "Events",
    description:
      "Take advantage of our variety of spaces to turn your next party or meeting into something unforgettable.",
    image: eventImage,
    path: "/events",
  },
  {
    title: "Activities",
    description: "Make your stay more memorable with our featured activities.",
    image: activitiesImage,
    path: "/activities",
  },
];

function ExperienceSection() {
  return (
    <section className="experience-section">
      <motion.div
        className="experience-section__intro"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h1>EXPERIENCE HAYA</h1>
        <p>Appreciate nature like never before</p>
      </motion.div>

      <div className="experience-section__grid">
        {experiences.map((experience, index) => (
          <motion.article
            className="experience-card"
            key={experience.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
            }}
          >
            <div className="experience-card__image-wrapper">
              <img
                src={experience.image}
                alt={experience.title}
                className="experience-card__image"
              />
            </div>

            <div className="experience-card__content">
              <Link to={experience.path} className="experience-card__button">
                {experience.title}
              </Link>

              <p>{experience.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ExperienceSection;
