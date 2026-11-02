import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is pre-rendered (scripts/prerender.mjs) → hydrate it; the dev server renders from scratch
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
