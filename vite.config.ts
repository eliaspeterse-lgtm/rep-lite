import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/",                 // viktigt i produktion
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ⛔ alla klient-importer av "openai" pekas till stubben
      openai: path.resolve(__dirname, "./src/stubs/openai.client.block.ts"),
    },
  },
});
