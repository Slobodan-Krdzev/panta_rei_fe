// Theme is set by <html data-theme="..."> in index.html
const isMetallic = document.documentElement.dataset.theme === "metallic";
const LOGO_SRC = isMetallic ? "/images/panta-rei-logo-metallic.png" : "/images/panta-rei-logo.jpg";

export default function Logo({ className = "" }) {
  return (
    <a className={`wordmark ${className}`.trim()} href="#top" aria-label="Група Панта Реи — почетна">
      <img className="brand-logo" src={LOGO_SRC} alt="Panta Rei Band" />
    </a>
  );
}
