// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("🔵 main.tsx start");

const el = document.getElementById("root");
if (!el) {
  console.error("❌ #root saknas i index.html");
  throw new Error("#root not found");
}

createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("🟢 main.tsx mounted");
