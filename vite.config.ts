import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  build: {
    outDir: "dist",
    assetsDir: "assests",
    // sourcemap: true,
  },
  base: "/taskzen/",
});
