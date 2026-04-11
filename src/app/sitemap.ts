import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { postsSlugsQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://sweettalks.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: any[] = await client.fetch(postsSlugsQuery).catch(() => []);

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((p) => p?.slug?.current)
    .map((p) => ({
      url: `${BASE_URL}/blog/${p.slug.current}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: new Date(p.updatedAt || p.publishedAt || Date.now()),
    }));

  const now = new Date();

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: now,
    },
    ...blogEntries,
  ];
}
