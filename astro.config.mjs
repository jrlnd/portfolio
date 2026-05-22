import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://jrlnd.dev",

  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});