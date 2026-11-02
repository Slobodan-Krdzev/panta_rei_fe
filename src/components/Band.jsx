import { Radio } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import { MEMBERS, pad } from "../data.js";

export default function Band() {
  return (
    <section className="band section" id="band">
      <SectionKicker number="03" label="Состав" />
      <div className="band-grid">
        <div className="band-intro">
          <p className="overline">Седуммина. Една сцена.</p>
          <h2>Луѓето зад звукот.</h2>
          <p>Различни инструменти, различни генерации и една иста љубов — музиката во живо.</p>
          <Radio className="band-icon" aria-hidden="true" />
        </div>
        <ol className="member-list">
          {MEMBERS.map((member, i) => (
            <li key={member.name}>
              <span className="member-number">{pad(i)}</span>
              <strong>{member.name}</strong>
              <span className="instrument">{member.instrument}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
