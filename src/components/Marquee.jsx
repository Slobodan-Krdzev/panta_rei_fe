import { MARQUEE_ITEMS } from "../data.js";

// Two identical groups so the CSS animation can loop seamlessly
export default function Marquee() {
  return (
    <div className="marquee" aria-label="Видови настапи">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group} aria-hidden={group === 1}>
            {MARQUEE_ITEMS.map((item) => (
              <span className="marquee-item" key={item}>
                <span>{item}</span>
                <i aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
