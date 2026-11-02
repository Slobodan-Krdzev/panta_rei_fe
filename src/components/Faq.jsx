import { Plus } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import { FAQ } from "../data.js";

export default function Faq() {
  return (
    <section className="faq section" id="faq">
      <SectionKicker number="05" label="Прашања" />
      <div className="faq-grid">
        <div className="faq-intro">
          <p className="overline">Пред да закажете</p>
          <h2>Бенд за свадба — најчести прашања.</h2>
          <p>Сè што треба да знаете пред да нè поканите на вашата свадба, крштевка или прослава.</p>
        </div>
        <div className="faq-list">
          {FAQ.map(({ q, a }, i) => (
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
  );
}
