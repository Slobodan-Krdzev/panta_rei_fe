import { ArrowUpRight, Camera, MessageCircle } from "lucide-react";
import { LINKS } from "../data.js";

const SOCIALS = [
  { href: LINKS.facebook, icon: MessageCircle, network: "Facebook", handle: "@pantareiband" },
  { href: LINKS.instagram, icon: Camera, network: "Instagram", handle: "@grupapantarei" },
];

export default function Repertoire() {
  return (
    <section className="repertoire section">
      <div className="repertoire-copy">
        <p className="overline">Слушнете нè во живо</p>
        <h2>Плејлистата кажува дел. Атмосферата — сè.</h2>
        <p>
          На нашите Facebook и Instagram профили може да погледнете дел од песните што ги
          изведуваме, фотографии и видеа од настапи. Но, нашиот совет е едноставен: дојдете да нè
          слушнете во живо.
        </p>
      </div>
      <div className="social-links">
        {SOCIALS.map(({ href, icon: Icon, network, handle }) => (
          <a className="social-card" href={href} target="_blank" rel="noreferrer" key={network}>
            <span className="social-icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="social-text">
              <small>{network}</small>
              <strong>{handle}</strong>
            </span>
            <ArrowUpRight className="arrow" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
