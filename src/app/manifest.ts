import type { MetadataRoute } from "next";
import { site } from "~/data/site";

/* Replaces the generator's site.webmanifest, which shipped with empty name
   fields. Colours match the white page, so the Android splash and browser
   chrome do not flash another colour before the page paints. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
