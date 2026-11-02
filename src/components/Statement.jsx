import { Music2 } from "lucide-react";

export default function Statement() {
  return (
    <section className="statement" aria-label="Нашиот музички избор">
      <p>
        НАШИОТ
        <br />
        ЗВУК ИМА
        <br />
        <em>СТАВ.</em>
      </p>
      <div className="statement-badge">
        <Music2 aria-hidden="true" />
        <span>
          Турбо фолк
          <br />
          <strong>не свириме.</strong>
        </span>
      </div>
    </section>
  );
}
