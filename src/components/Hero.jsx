import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { LINKS } from "../data.js";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">
          <MapPin aria-hidden="true" /> Гевгелија <span className="dot" /> Од 2000
        </p>
        <h1>
          <span>ГРУПА</span>
          <span>ПАНТА</span>
          <span className="accent-word">РЕИ</span>
        </h1>
        <p className="hero-lead">
          Музика што се памети.
          <br />
          Вечери што се прераскажуваат.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={LINKS.facebook} target="_blank" rel="noreferrer">
            Закажете настап <ArrowUpRight aria-hidden="true" />
          </a>
          <a className="button button-ghost" href="#about">
            Запознајте нè <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <img src="/images/panta-rei-formal.jpg" alt="Членовите на Група Панта Реи во сценски костуми" />
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
