import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sigorta CRM PWA",
    short_name: "SigortaCRM",
    description:
      "Sigorta acenteleri için müşteri, poliçe, lead, personel ve operasyon yönetim paneli.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5efe4",
    theme_color: "#0c4a6e",
    lang: "tr-TR",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
