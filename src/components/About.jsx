import SectionKicker from "./SectionKicker.jsx";
import { FACTS } from "../data.js";

export default function About() {
  return (
    <section className="about section" id="about">
      <SectionKicker number="01" label="Нашата приказна" />
      <div className="about-grid">
        <div className="about-image-wrap">
          <img
            src="/images/panta-rei-casual.webp"
            srcSet="/images/panta-rei-casual-1000.webp 1000w, /images/panta-rei-casual.webp 2000w"
            sizes="(max-width: 960px) 100vw, 50vw"
            width="2000"
            height="1333"
            loading="lazy"
            alt="Музичарите од бендот Панта Реи со своите инструменти — музика во живо за свадби и прослави"
          />
          <span className="vertical-note">ЗАЕДНО НА СЦЕНА ОД 2000</span>
        </div>
        <div className="about-copy">
          <p className="overline">Здраво, ние сме</p>
          <h2>Бенд со ритам, карактер и искуство.</h2>
          <p className="large-copy">
            Група Панта Реи е бенд за свадби и прослави од Гевгелија. Основани сме во 2000 година и
            оттогаш без престан настапуваме низ Македонија и пошироко.
          </p>
          <p>
            Од интимни семејни прослави до големи клубски и корпоративни настани — на секоја сцена
            носиме жив звук, широка музичка слика и искрена енергија.
          </p>
          <div className="about-facts">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
