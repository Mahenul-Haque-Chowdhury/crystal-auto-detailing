import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://crystalvalley.autos";
  const now = new Date().toISOString();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/discounts`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
