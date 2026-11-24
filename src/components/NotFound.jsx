import { ArrowLeft, ArrowUpRight, Music } from "lucide-react";
import { ContactButton } from "../contact/ContactModal.jsx";
import Booking from "./Booking.jsx";
import { SERVICE_PAGES } from "../pages.js";

// Shown for any unknown URL. Pre-rendered to dist/404.html, which Vercel serves with a real 404 status.
export default function NotFound() {
  return (
    <>
      <section className="hero landing-hero notfound" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <Music aria-hidden="true" /> Грешка 404 <span className="dot" /> Страницата не постои
          </p>
          <h1>
            Погрешна <span className="accent-word">нота.</span>
          </h1>
          <p className="hero-lead">
            Страницата што ја барате не постои или е преместена. Вратете се на почетната или јавете ни се директно.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/">
              <ArrowLeft aria-hidden="true" /> Кон почетната
            </a>
            <ContactButton className="button button-ghost">
              Контакт <ArrowUpRight aria-hidden="true" />
            </ContactButton>
          </div>
        </div>
        <div className="notfound-code" aria-hidden="true">
          <span className="accent-word">4</span>
          <span className="notfound-record" />
          <span className="accent-word">4</span>
        </div>
      </section>

      <section className="section dark-section related" aria-labelledby="notfound-links-title">
        <div>
          <p className="overline">Можеби го баравте ова</p>
          <h2 id="notfound-links-title">Продолжете од тука.</h2>
          <ul className="related-grid">
            {SERVICE_PAGES.map((p) => (
              <li key={p.slug}>
                <a className="related-card" href={`/${p.slug}`}>
                  <span>{p.navLabel}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Booking />
    </>
  );
}
