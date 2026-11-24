import { ArrowDown, ArrowUpRight, Check, MapPin, Plus } from "lucide-react";
import { ContactButton } from "../contact/ContactModal.jsx";
import SectionKicker from "./SectionKicker.jsx";
import Videos from "./Videos.jsx";
import Gallery from "./Gallery.jsx";
import Booking from "./Booking.jsx";
import { FACTS } from "../data.js";
import { CITY_PAGES, hasVideos, SERVICE_PAGES } from "../pages.js";

// A service or city page (see src/pages.js). Shares the header, gallery, booking and footer with the home page.
export default function LandingPage({ page }) {
  const { eyebrow, h1, lead, image, sections, faq } = page;
  const services = SERVICE_PAGES.filter((p) => p.slug !== page.slug);
  const videos = hasVideos(page);
  const cities = CITY_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <>
      <section className="hero landing-hero" id="top">
        <div className="hero-copy">
          <nav className="breadcrumb" aria-label="Патека">
            <a href="/">Почетна</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.navLabel}</span>
          </nav>
          <p className="eyebrow">
            <MapPin aria-hidden="true" /> {eyebrow[0]} <span className="dot" /> {eyebrow[1]}
          </p>
          <h1>
            {h1[0]} <span className="accent-word">{h1[1]}</span>
          </h1>
          <p className="hero-lead">{lead}</p>
          <div className="hero-actions">
            <ContactButton className="button button-primary">
              Проверете слободен датум <ArrowUpRight aria-hidden="true" />
            </ContactButton>
            <a className="button button-ghost" href="#details">
              Дознајте повеќе <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src={image.src}
            srcSet={`${image.srcSm} 900w, ${image.src} 1800w`}
            sizes="(max-width: 960px) 100vw, 55vw"
            width={image.width}
            height={image.height}
            fetchPriority="high"
            alt={image.alt}
          />
        </div>
      </section>

      <section className="section landing-details" id="details">
        <SectionKicker number="01" label={page.label} />
        {sections.map((s) => (
          <div className="landing-block" key={s.title}>
            <h2>{s.title}</h2>
            <div className="landing-block-body">
              {s.text?.map((t) => <p key={t}>{t}</p>)}
              {s.list && (
                <ul className="check-list">
                  {s.list.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        <div className="about-facts landing-facts">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      {videos && <Videos number="02" />}

      <Gallery number={videos ? "03" : "02"} />

      <section className="faq section" id="faq">
        <SectionKicker number={videos ? "04" : "03"} label="Прашања" />
        <div className="faq-grid">
          <div className="faq-intro">
            <p className="overline">Пред да закажете</p>
            <h2>{page.navLabel} — прашања.</h2>
            <p>Не го најдовте одговорот? Јавете ни се директно — секој член од бендот е на располагање.</p>
          </div>
          <div className="faq-list">
            {faq.map(({ q, a }, i) => (
              <details key={q} open={i === 0}>
                <summary>
                  <h3>{q}</h3>
                  <Plus aria-hidden="true" />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section related" aria-labelledby="related-title">
        <div>
          <p className="overline">Свириме насекаде</p>
          <h2 id="related-title">Каде и за што свириме.</h2>
          <ul className="related-grid">
            {services.map((p) => (
              <li key={p.slug}>
                <a className="related-card" href={`/${p.slug}`}>
                  <span>{p.navLabel}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
            <li>
              <a className="related-card" href="/">
                <span>Група Панта Реи — почетна</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          </ul>
          <h3 className="related-subtitle">Бенд за свадба низ цела Македонија</h3>
          <ul className="city-chips">
            {cities.map((p) => (
              <li key={p.slug}>
                <a href={`/${p.slug}`}>{p.city}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Booking />
    </>
  );
}
