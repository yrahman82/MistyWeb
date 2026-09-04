import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060d1a",
    theme_color: "#060d1a",
    icons: [
      // The app serves app/icon.png at /icon.png (1024×1024). Point the manifest at the real file
      // (the previous /icon.svg reference 404'd). Declared for the common PWA install sizes.
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
    ],
  };
}
