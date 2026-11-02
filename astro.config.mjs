import { defineConfig } from "astro/config";

// BASE_PATH is set by the deploy workflow. It is "/web" on a default GitHub
// Pages URL and empty once a custom domain is connected.
export default defineConfig({
  site: process.env.SITE_URL || "https://www.consistly.com",
  base: process.env.BASE_PATH || "/",
  devToolbar: { enabled: false },
});
