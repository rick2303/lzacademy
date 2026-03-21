// app/robots.ts
// Next.js lo sirve automáticamente en /robots.txt

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://lz-englishacademy.com/sitemap.xml",
  };
}
