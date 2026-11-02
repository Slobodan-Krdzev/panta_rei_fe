import SectionKicker from "./SectionKicker.jsx";
import { OCCASIONS, pad } from "../data.js";

export default function Occasions() {
  return (
    <section className="occasions section dark-section" id="occasions">
      <SectionKicker number="02" label="Каде свириме" light />
      <div className="section-heading-row">
        <h2>
          За секоја
          <br />
          добра прилика.
        </h2>
        <p>
          Настапуваме во клубови, дискотеки, кафани и на секаков вид прослави — од свадби и
          крштевки до корпоративни забави.
        </p>
      </div>
      <div className="occasion-grid">
        {OCCASIONS.map(({ icon: Icon, title, text }, i) => (
          <article className="occasion-card" key={title}>
            <div className="card-top">
              <span>{pad(i)}</span>
              <Icon aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
