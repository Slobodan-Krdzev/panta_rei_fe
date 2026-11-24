import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import About from "./components/About.jsx";
import Occasions from "./components/Occasions.jsx";
import Band from "./components/Band.jsx";
import Videos from "./components/Videos.jsx";
import Gallery from "./components/Gallery.jsx";
import Statement from "./components/Statement.jsx";
import Repertoire from "./components/Repertoire.jsx";
import Faq from "./components/Faq.jsx";
import Booking from "./components/Booking.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./components/LandingPage.jsx";
import NotFound from "./components/NotFound.jsx";
import { ContactProvider } from "./contact/ContactModal.jsx";
import { findPage, isHome } from "./pages.js";

// `path` is the URL path: "/" renders the home page, "/svadbi" etc. a landing page from src/pages.js, anything else the 404 page
export default function App({ path = "/" }) {
  const page = findPage(path);
  return (
    <ContactProvider>
      <Header />
      <main>{page ? <LandingPage page={page} /> : isHome(path) ? <Home /> : <NotFound />}</main>
      <Footer />
    </ContactProvider>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Occasions />
      <Band />
      <Videos />
      <Gallery />
      <Statement />
      <Repertoire />
      <Faq />
      <Booking />
    </>
  );
}
