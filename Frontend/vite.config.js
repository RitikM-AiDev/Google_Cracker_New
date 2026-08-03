import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "g-crack-jslo.onrender.com",
      "g-crack.onrender.com",
      "google-cracker-new.vercel.app",
      "google-cracker-new.vercel.app/"
    ]
  }
});
