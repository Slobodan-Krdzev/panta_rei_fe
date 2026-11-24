import Logo from "./Logo.jsx";
import { EMAIL, LINKS } from "../data.js";
import { CITY_PAGES, SERVICE_PAGES } from "../pages.js";

export default function Footer() {
  return (
    <footer>
      <Logo className="footer-mark" />
      <p>Бенд за свадби и прослави · Гевгелија, Македонија</p>
      <p lang="mk-Latn">Panta Rei — bend za svadbi i proslavi od Gevgelija</p>
      <nav className="footer-pages" aria-label="Услуги">
        {SERVICE_PAGES.map((p) => (
          <a key={p.slug} href={`/${p.slug}`}>{p.navLabel}</a>
        ))}
      </nav>
      <nav className="footer-pages footer-cities" aria-label="Бенд за свадба по градови">
        <span>Бенд за свадба:</span>
        {CITY_PAGES.map((p) => (
          <a key={p.slug} href={`/${p.slug}`}>{p.city}</a>
        ))}
      </nav>
      <p className="footer-links">
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <a href={LINKS.facebook} target="_blank" rel="noreferrer">Facebook</a>
        <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <a href={LINKS.youtube} target="_blank" rel="noreferrer">YouTube</a>
        <span>Музика во живо од 2000</span>
      </p>
    </footer>
  );
}
