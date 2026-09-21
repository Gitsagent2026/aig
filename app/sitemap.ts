import type { MetadataRoute } from "next"

import { buildSitemapEntries } from "@/lib/seo-indexing"

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries()
}
