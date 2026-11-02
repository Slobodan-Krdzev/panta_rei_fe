import ContactList from "../contact/ContactList.jsx";
import SocialButtons from "../contact/SocialButtons.jsx";

export default function Booking() {
  return (
    <section className="booking" id="booking">
      <p className="overline">Вашиот датум. Нашиот звук.</p>
      <h2>
        Да направиме
        <br />
        вечер за паметење.
      </h2>
      <p className="booking-intro">Јавете ни се директно — секој член од бендот е на располагање.</p>
      <ContactList className="booking-contacts" />
      <SocialButtons />
    </section>
  );
}
