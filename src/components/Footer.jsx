import Logo from "./Logo.jsx";
import { LINKS } from "../data.js";
import { CITY_PAGES, SERVICE_PAGES } from "../pages.js";

export default function Footer() {
  return (
    <footer>
      <Logo className="footer-mark" />
      <p>Свадбарски бенд за свадби и прослави · Гевгелија, Северна Македонија</p>
      <p lang="mk-Latn">Panta Rei — bend za svadbi i proslavi, svadbarski bend od Gevgelija</p>
      <nav className="footer-pages" aria-label="Услуги и градови">
        {[...SERVICE_PAGES, ...CITY_PAGES].map((p) => (
          <a key={p.slug} href={`/${p.slug}`}>{p.navLabel}</a>
        ))}
      </nav>
      <p className="footer-links">
        <a href={LINKS.facebook} target="_blank" rel="noreferrer">Facebook</a>
        <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <span>Музика во живо од 2000</span>
      </p>
    </footer>
  );
}
