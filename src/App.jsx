import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import About from "./components/About.jsx";
import Occasions from "./components/Occasions.jsx";
import Band from "./components/Band.jsx";
import Gallery from "./components/Gallery.jsx";
import Statement from "./components/Statement.jsx";
import Repertoire from "./components/Repertoire.jsx";
import Faq from "./components/Faq.jsx";
import Booking from "./components/Booking.jsx";
import Footer from "./components/Footer.jsx";
import { ContactProvider } from "./contact/ContactModal.jsx";

export default function App() {
  return (
    <ContactProvider>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Occasions />
        <Band />
        <Gallery />
        <Statement />
        <Repertoire />
        <Faq />
        <Booking />
      </main>
      <Footer />
    </ContactProvider>
  );
}
