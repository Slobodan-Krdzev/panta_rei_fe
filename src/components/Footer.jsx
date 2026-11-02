import Logo from "./Logo.jsx";
import { LINKS } from "../data.js";

export default function Footer() {
  return (
    <footer>
      <Logo className="footer-mark" />
      <p>Бенд за свадби и прослави · Гевгелија, Северна Македонија</p>
      <p className="footer-links">
        <a href={LINKS.facebook} target="_blank" rel="noreferrer">Facebook</a>
        <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <span>Музика во живо од 2000</span>
      </p>
    </footer>
  );
}
