import type { MetadataRoute } from "next";
import { agencies } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://adncrm.onrender.com";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/giris`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...agencies.map((agency) => ({
      url: `${baseUrl}/acente/${agency.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
