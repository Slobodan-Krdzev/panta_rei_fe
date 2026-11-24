import { AREAS_SERVED, CONTACTS, EMAIL, FAQ, LINKS, MEMBERS, watchUrl } from "./data.js";
import PHOTOS from "./gallery.json";
import VIDEOS from "./videos.json";
import { hasVideos } from "./pages.js";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
export const SITE_NAME = "Група Панта Реи";

// One VideoObject per video in the video section (src/videos.json)
const videoObjects = () =>
  VIDEOS.map((v) => ({
    "@type": "VideoObject",
    "@id": `${SITE_URL}/#video-${v.id}`,
    name: v.title,
    description: v.description,
    thumbnailUrl: `${SITE_URL}${v.thumb}`,
    uploadDate: v.uploadDate,
    duration: `PT${Math.floor(v.seconds / 60)}M${v.seconds % 60}S`,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    sameAs: watchUrl(v.id),
    inLanguage: "mk-MK",
    publisher: { "@id": `${SITE_URL}/#band` },
  }));

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
      "Бенд за свадби и прослави од Гевгелија. Седумчлен бенд со музика во живо за свадби, крштевки, прослави, клубови и корпоративни настани низ цела Македонија, од 2000 година.",
    slogan: "Музика што се памети.",
    keywords:
      "свадби, бенд за свадба, бендови за свадби, свадбарски бенд, свадбарски бендови, музика во живо, bend za svadbi, bendovi za svadbi, svadbarski bendovi",
    url,
    logo: abs("/icon-512.png"),
    image: [abs("/og-image.jpg"), abs("/images/panta-rei-formal.webp"), abs("/images/panta-rei-casual.webp")],
    foundingDate: "2000",
    foundingLocation: { "@type": "Place", name: "Гевгелија, Македонија" },
    address: { "@type": "PostalAddress", addressLocality: "Гевгелија", addressCountry: "MK" },
    geo: { "@type": "GeoCoordinates", latitude: 41.1406, longitude: 22.5025 },
    areaServed: [
      { "@type": "Country", name: "Македонија", alternateName: "North Macedonia" },
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
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, areaServed: { "@type": "Country", name: "Македонија" } } })
    ),
    telephone: CONTACTS[0].phone,
    email: EMAIL,
    contactPoint: CONTACTS.map((m) => ({
      "@type": "ContactPoint",
      name: m.name,
      telephone: m.phone,
      contactType: "reservations",
      availableLanguage: ["mk"],
      areaServed: "MK",
    })),
    sameAs: [LINKS.facebook, LINKS.instagram, LINKS.youtube],
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

  return { "@context": "https://schema.org", "@graph": [band, website, page, gallery, ...videoObjects(), faq] };
}

// schema.org JSON-LD for a landing page from src/pages.js: the page, the service it offers, breadcrumbs and its FAQ.
// The band itself is described in full on the home page; here it is referenced by @id.
export function pageStructuredData(page) {
  const home = `${SITE_URL}/`;
  const url = `${SITE_URL}/${page.slug}`;
  const band = { "@type": "MusicGroup", "@id": `${home}#band`, name: SITE_NAME, url: home, telephone: CONTACTS[0].phone, email: EMAIL };
  const area = page.city
    ? { "@type": "City", name: page.city, containedInPlace: { "@type": "Country", name: "Македонија" } }
    : { "@type": "Country", name: "Македонија" };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "mk-MK",
        isPartOf: { "@id": `${home}#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${page.image.src}`, width: page.image.width, height: page.image.height },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.service,
        serviceType: page.service,
        description: page.description,
        url,
        provider: band,
        areaServed: area,
        image: `${SITE_URL}${page.image.src}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Почетна", item: home },
          { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: page.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
      ...(hasVideos(page) ? videoObjects() : []),
    ],
  };
}
