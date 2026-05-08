// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://fastgaragedoorrepaircrestview.com",
  trailingSlash: "always",
  compressHTML: true,
  output: "static",
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
