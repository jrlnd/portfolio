import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO: replace with your real production URL before deploy
  site: "https://example.com",

  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
