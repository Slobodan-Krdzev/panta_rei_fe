import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { ContactButton } from "../contact/ContactModal.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">
          <MapPin aria-hidden="true" /> Бенд за свадби <span className="dot" /> Гевгелија <span className="dot" /> Од 2000
        </p>
        <h1>
          {/* the spaces keep the words separate for search engines; the layout stacks them */}
          <span>ГРУПА</span> <span>ПАНТА</span> <span className="accent-word">РЕИ</span>
        </h1>
        <p className="hero-lead">
          Музика што се памети.
          <br />
          Вечери што се прераскажуваат.
        </p>
        <div className="hero-actions">
          <ContactButton className="button button-primary">
            Закажете настап <ArrowUpRight aria-hidden="true" />
          </ContactButton>
          <a className="button button-ghost" href="#about">
            Запознајте нè <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <img
          src="/images/panta-rei-formal.webp"
          srcSet="/images/panta-rei-formal-1000.webp 1000w, /images/panta-rei-formal.webp 2000w"
          sizes="(max-width: 960px) 100vw, 55vw"
          width="2000"
          height="1333"
          fetchPriority="high"
          alt="Група Панта Реи — бенд за свадби од Гевгелија, седумте членови во сценски костуми"
        />
        <div className="hero-stamp" aria-label="Седум музичари, еден звук">
          <strong>7</strong>
          <span>
            музичари
            <br />
            еден звук
          </span>
        </div>
        <p className="image-caption">Гевгелија · Македонија</p>
      </div>
    </section>
  );
}
