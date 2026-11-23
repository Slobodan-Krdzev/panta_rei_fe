// Server entry used only at build time: scripts/prerender.mjs renders the page to static HTML
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export { structuredData, pageStructuredData, SITE_URL } from "./seo.js";
export { PAGES } from "./pages.js";
export { default as PHOTOS } from "./gallery.json";

export const render = (path = "/") =>
  renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  );
