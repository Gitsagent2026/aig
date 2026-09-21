import { canonicalUrlForPath, SITE_CONTENT_UPDATED_AT } from "@/lib/site-url"

export const PUBLIC_UI_SITEMAP_PATHS = ["/"] as const

export const ROBOTS_DISALLOW_RULES = [
  "/api/",
  "/authentication/handshake",
  "/blocked",
  "/forgot-password",
  "/forgot-password-code",
  "/forgot-password-found",
  "/forgot-password-verify",
  "/new-user",
  "/new-user-code",
  "/new-user-password",
  "/verify",
  "/verify-choice",
  "/verify-identity",
] as const

const NORMALIZED_PUBLIC_UI_PATHS = new Set<string>(PUBLIC_UI_SITEMAP_PATHS)

export const NON_INDEXABLE_HEADER_VALUE = "noindex, nofollow" as const

function normalizePathname(pathname: string): string {
  if (!pathname) return "/"
  const withoutQuery = pathname.split("?")[0]?.split("#")[0] ?? "/"
  if (withoutQuery === "/") return "/"
  return withoutQuery.endsWith("/") ? withoutQuery.slice(0, -1) : withoutQuery
}

export function isIndexableUiPath(pathname: string): boolean {
  return NORMALIZED_PUBLIC_UI_PATHS.has(normalizePathname(pathname))
}

export function shouldApplyNoindexHeader(pathname: string): boolean {
  const normalizedPath = normalizePathname(pathname)
  if (normalizedPath === "/robots.txt" || normalizedPath === "/sitemap.xml") {
    return false
  }
  if (normalizedPath.startsWith("/api/")) return false
  if (normalizedPath.startsWith("/_next/")) return false
  if (/\.[a-z0-9]+$/i.test(normalizedPath)) return false
  return !isIndexableUiPath(normalizedPath)
}

export function buildSitemapEntries() {
  return PUBLIC_UI_SITEMAP_PATHS.map((pathname) => ({
    url: canonicalUrlForPath(pathname),
    lastModified: SITE_CONTENT_UPDATED_AT,
    changeFrequency: "weekly" as const,
    priority: pathname === "/" ? 1 : 0.8,
  }))
}
