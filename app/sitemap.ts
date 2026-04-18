import type { MetadataRoute } from "next";

const BASE = "https://lz-englishacademy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date("2025-04-01"), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/interes`, lastModified: new Date("2025-03-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/metodo`, lastModified: new Date("2025-03-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/historia`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ciencia`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/como-funciona`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sesiones`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/fundacion`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.6 },
  ];
}
