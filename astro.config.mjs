// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "cy"],
    defaultLocale: "en",
  },
  integrations: [icon()],
});
