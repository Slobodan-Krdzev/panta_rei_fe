import { ArrowUpRight } from "lucide-react";
import { LINKS } from "../data.js";

export default function Booking() {
  return (
    <section className="booking" id="booking">
      <p className="overline">Вашиот датум. Нашиот звук.</p>
      <h2>
        Да направиме
        <br />
        вечер за паметење.
      </h2>
      <a className="booking-link" href={LINKS.facebook} target="_blank" rel="noreferrer">
        Пишете ни <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
