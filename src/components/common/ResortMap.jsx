import resortMap from "../../assets/haya/HAYA MAP .png";
import "./ResortMap.css";

function ResortMap() {
  return (
    <section className="haya-resort-map" aria-label="Haya Nature Resort map">
      <img
        src={resortMap}
        alt="Haya Nature Resort property map showing the resort layout"
        loading="lazy"
      />
    </section>
  );
}

export default ResortMap;
