import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ADN CRM Suite",
    short_name: "ADN CRM",
    description:
      "ADN Trust icin sigorta operasyon, police, lead ve ekip yonetim paneli.",
    start_url: "/",
    display: "standalone",
    background_color: "#10151d",
    theme_color: "#10151d",
    lang: "tr-TR",
    icons: [
      {
        src: "/adnlogo.png",
        sizes: "768x768",
        type: "image/png",
      },
    ],
  };
}
