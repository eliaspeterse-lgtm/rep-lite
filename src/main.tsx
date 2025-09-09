// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hjälp att se fel i prod
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) =>
    console.error("Global error:", (e as any).error || e.message)
  );
  window.addEventListener("unhandledrejection", (e) =>
    console.error("Unhandled:", (e as any).reason)
  );
}

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
