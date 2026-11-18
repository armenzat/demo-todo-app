import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH lets the same build be served from a sub-path (e.g. a staging folder).
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
});
