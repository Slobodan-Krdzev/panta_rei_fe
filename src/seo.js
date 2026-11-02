import { AREAS_SERVED, CONTACTS, FAQ, LINKS, MEMBERS } from "./data.js";
import PHOTOS from "./gallery.json";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
export const SITE_NAME = "Група Панта Реи";

// schema.org JSON-LD for the home page (injected into <head> by scripts/prerender.mjs)
export function structuredData() {
  const url = `${SITE_URL}/`;
  const abs = (p) => `${SITE_URL}${p}`;

  const band = {
    "@type": ["MusicGroup", "EntertainmentBusiness"],
    "@id": `${url}#band`,
    name: SITE_NAME,
    alternateName: ["Панта Реи", "Panta Rei", "Panta Rei Band", "Grupa Panta Rei"],
    description:
      "Бенд за свадби и прослави од Гевгелија. Седумчлен бенд со музика во живо за свадби, крштевки, прослави, клубови и корпоративни настани низ цела Северна Македонија, од 2000 година.",
    slogan: "Музика што се памети.",
    url,
    logo: abs("/icon-512.png"),
    image: [abs("/og-image.jpg"), abs("/images/panta-rei-formal.webp"), abs("/images/panta-rei-casual.webp")],
    foundingDate: "2000",
    foundingLocation: { "@type": "Place", name: "Гевгелија, Северна Македонија" },
    address: { "@type": "PostalAddress", addressLocality: "Гевгелија", addressCountry: "MK" },
    geo: { "@type": "GeoCoordinates", latitude: 41.1406, longitude: 22.5025 },
    areaServed: [
      { "@type": "Country", name: "Северна Македонија", alternateName: "North Macedonia" },
      ...AREAS_SERVED.map((name) => ({ "@type": "City", name })),
    ],
    knowsLanguage: ["mk"],
    numberOfEmployees: { "@type": "QuantitativeValue", value: MEMBERS.length },
    member: MEMBERS.map((m) => ({
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: m.name },
      roleName: m.instrument,
    })),
    makesOffer: ["Музика во живо за свадби", "Музика за крштевки и семејни прослави", "Настапи во клубови и кафани", "Музика за корпоративни настани"].map(
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, areaServed: { "@type": "Country", name: "Северна Македонија" } } })
    ),
    telephone: CONTACTS[0].phone,
    contactPoint: CONTACTS.map((m) => ({
      "@type": "ContactPoint",
      name: m.name,
      telephone: m.phone,
      contactType: "reservations",
      availableLanguage: ["mk"],
      areaServed: "MK",
    })),
    sameAs: [LINKS.facebook, LINKS.instagram],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name: SITE_NAME,
    inLanguage: "mk-MK",
    publisher: { "@id": `${url}#band` },
  };

  const page = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Панта Реи — Бенд за свадби во Македонија | Музика во живо",
    inLanguage: "mk-MK",
    isPartOf: { "@id": `${url}#website` },
    about: { "@id": `${url}#band` },
    primaryImageOfPage: { "@type": "ImageObject", url: abs("/images/panta-rei-formal.webp"), width: 2000, height: 1333 },
  };

  const gallery = {
    "@type": "ImageGallery",
    "@id": `${url}#gallery`,
    name: "Галерија — Група Панта Реи во живо",
    isPartOf: { "@id": `${url}#webpage` },
    image: PHOTOS.map((p) => ({ "@type": "ImageObject", contentUrl: abs(p.lg), width: p.width, height: p.height })),
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return { "@context": "https://schema.org", "@graph": [band, website, page, gallery, faq] };
}
