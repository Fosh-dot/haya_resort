import "./Events.css";

import event01 from "../../assets/haya/Events/event-01.jpg";
import event02 from "../../assets/haya/Events/event-02.jpg";
import event03 from "../../assets/haya/Events/event-03.jpg";
import event04 from "../../assets/haya/Events/event-04.jpg";
import event05 from "../../assets/haya/Events/event-05.jpg";
import event06 from "../../assets/haya/Events/event-06.jpg";
import event07 from "../../assets/haya/Events/event-07.jpg";
import event08 from "../../assets/haya/Events/event-08.jpg";
import event09 from "../../assets/haya/Events/event-09.jpg";
import event10 from "../../assets/haya/Events/event-10.jpg";
import event11 from "../../assets/haya/Events/event-11.jpg";
import event12 from "../../assets/haya/Events/event-12.jpg";
import event13 from "../../assets/haya/Events/event-013.jpg";
import event14 from "../../assets/haya/Events/event-14.jpg";
import event15 from "../../assets/haya/Events/event-015.jpg";

const eventImages = [
  event01,
  event02,
  event03,
  event04,
  event05,
  event06,
  event07,
  event08,
  event09,
  event10,
  event11,
  event12,
  event13,
  event14,
  event15,
];

function Events() {
  return (
    <main className="haya-events-page">
      <section className="haya-events-intro">
        <h1>BEAUTIFUL BEGINNINGS</h1>

        <h2>By Haya Nature Resort</h2>

        <p>
          There are lots of events happening throughout the year, and no better
          place to host them than at Haya Nature Resort. Get in touch to learn
          more, we're looking forward to hosting your next event!
        </p>
      </section>

      <section className="haya-events-gallery" aria-label="Events gallery">
        {eventImages.map((image, index) => (
          <figure className="haya-events-gallery-item" key={image}>
            <img
              src={image}
              alt={`Haya Nature Resort event ${index + 1}`}
              loading={index > 3 ? "lazy" : "eager"}
            />
          </figure>
        ))}
      </section>
    </main>
  );
}

export default Events;
