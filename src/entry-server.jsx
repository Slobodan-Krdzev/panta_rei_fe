// Server entry used only at build time: scripts/prerender.mjs renders the page to static HTML
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export { structuredData, SITE_URL } from "./seo.js";
export { default as PHOTOS } from "./gallery.json";

export const render = () =>
  renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
