import { Phone } from "lucide-react";
import { CONTACTS, formatPhone } from "../data.js";

// Every band member with a tap-to-call link
export default function ContactList({ className = "" }) {
  return (
    <ul className={`contact-list ${className}`.trim()}>
      {CONTACTS.map(({ name, instrument, phone }) => (
        <li key={phone}>
          <a className="contact-item" href={`tel:${phone}`} aria-label={`Јавете се на ${name}, ${formatPhone(phone)}`}>
            <span className="contact-icon">
              <Phone aria-hidden="true" />
            </span>
            <span className="contact-person">
              <strong>{name}</strong>
              <small>{instrument}</small>
            </span>
            <span className="contact-number">{formatPhone(phone)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
