import { defineConfig, UserConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }): UserConfig => ({
  server: {
    host: "::",
    port: 5175,
  },
  plugins: [
    react(),
    mode === "development" ? (componentTagger() as Plugin) : null,
  ].filter((plugin): plugin is Plugin => plugin !== null),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));