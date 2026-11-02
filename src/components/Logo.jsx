// Theme comes from VITE_THEME in .env (also sets <html data-theme> in index.html)
const LOGO_SRC =
  import.meta.env.VITE_THEME === "metallic" ? "/images/panta-rei-logo-metallic.png" : "/images/panta-rei-logo.jpg";

export default function Logo({ className = "" }) {
  return (
    <a className={`wordmark ${className}`.trim()} href="#top" aria-label="Група Панта Реи — почетна">
      <img className="brand-logo" src={LOGO_SRC} width="600" height="255" alt="Група Панта Реи — лого" />
    </a>
  );
}
