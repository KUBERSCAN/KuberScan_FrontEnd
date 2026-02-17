import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  server: {
    host: true,      // acepta 0.0.0.0 y 127.0.0.1
    port: 5173,
    strictPort: true,
    cors: true,      // permite CORS desde cualquier origen
  },
});
