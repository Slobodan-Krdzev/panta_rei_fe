import { useEffect, useRef } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import Logo from "./Logo.jsx";
import { ContactButton } from "../contact/ContactModal.jsx";
import { LINKS, NAV } from "../data.js";

const MOBILE_LINKS = [
  ...NAV,
  { href: LINKS.facebook, label: "Facebook", external: true },
  { href: LINKS.instagram, label: "Instagram", external: true },
];

export default function Header() {
  const menuRef = useRef(null);

  // Close the mobile menu on outside click or Escape
  useEffect(() => {
    const close = () => menuRef.current?.removeAttribute("open");
    const onClick = (e) => {
      if (menuRef.current?.open && !menuRef.current.contains(e.target)) close();
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Главна навигација">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <ContactButton className="header-cta">
          <span>Контакт</span>
          <ArrowUpRight aria-hidden="true" />
        </ContactButton>
        <details className="mobile-menu" ref={menuRef}>
          <summary aria-label="Отвори мени">
            <Menu aria-hidden="true" />
          </summary>
          <nav className="mobile-menu-panel" aria-label="Мобилна навигација">
            <p>Мени</p>
            <ContactButton className="mobile-menu-contact" onOpen={() => menuRef.current?.removeAttribute("open")}>
              <span>Контакт</span>
              <ArrowUpRight aria-hidden="true" />
            </ContactButton>
            {MOBILE_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => menuRef.current?.removeAttribute("open")}
                {...(item.external && { target: "_blank", rel: "noreferrer" })}
              >
                <span>{item.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
