import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"
import { readRiskCookie } from "@/lib/bot-risk/cookie"
import { applyNavProofCookie } from "@/lib/bot-risk/proof-cookies"
import { isMitigationBand } from "@/lib/bot-risk/score"
import { notifyBotCrawlIfNeeded } from "@/lib/bot-verification/bot-crawl-middleware"
import { isDeniedBotUserAgent } from "@/lib/bot-verification/denied-bots"
import {
  isAppleCrawlerUA,
  isBaiduCrawlerUA,
  isBingCrawlerUA,
  isCrawlerSeoPageUA,
  isDuckDuckCrawlerUA,
  isGoogleCrawlerUA,
  isSearchCrawlerUA,
  isYahooCrawlerUA,
} from "@/lib/bot-detection"
import { buildErrorScreenHtml } from "@/lib/error-screen-html"
import { getRequestCountryCode } from "@/lib/edge-geo"
import { GEO_US_ONLY_HEADER } from "@/lib/geo-us-header"
import { isLocalTestingUnlocked } from "@/lib/local-testing"
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths"
import {
  NON_INDEXABLE_HEADER_VALUE,
  shouldApplyNoindexHeader,
} from "@/lib/seo-indexing"
import { isUngatedSeoPath } from "@/lib/seo-public-paths"
import { SITE_URL } from "@/lib/site-url"
import { isYandexVerificationPath } from "@/lib/yandex-verification"
import { isTrustedCrawlerUserAgent } from "@/utils/botDetection"

// IndexNow key files (/{32-hex}.txt) are allowed via isUngatedSeoPath().

/** Public assets — must not be blocked by geo or bot rules. */
const PUBLIC_BRAND_ASSETS = new Set([
  "/error-icon.png",
  "/favicon.ico",
  "/favicon.png",
  "/icon-48x48.png",
  "/icon-32x32.png",
  "/apple-touch-icon.png",
  "/og-image.png",
  // "/BBPAdmin_Alegeus_Logo_Blue_Service.4ec5724d58c34a02b47bdfd467112a82.png",
  "/logo.png",
])

/**
 * Single place that stamps search-crawler request headers.
 * Always pass the returned Headers into nextWithHeaders — never rebuild from request.headers.
 * @see SEO_CRAWLER_RULES.md — HARD RULES: crawler header integrity
 */
function applySearchCrawlerHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers)
  const ua = request.headers.get("user-agent") ?? ""
  const { pathname } = request.nextUrl

  requestHeaders.set("x-pathname", pathname)

  // Denied bots never get crawler SEO stamps (even if UA contains "bot").
  if (isDeniedBotUserAgent(ua)) {
    return requestHeaders
  }

  if (isSearchCrawlerUA(ua)) {
    requestHeaders.set("x-is-search-crawler", "1")
    if (isGoogleCrawlerUA(ua)) requestHeaders.set("x-is-googlebot", "1")
    if (isBingCrawlerUA(ua)) requestHeaders.set("x-is-bingbot", "1")
    if (isDuckDuckCrawlerUA(ua)) requestHeaders.set("x-is-duckduckbot", "1")
    if (isYahooCrawlerUA(ua)) requestHeaders.set("x-is-yahoobot", "1")
    if (isAppleCrawlerUA(ua)) requestHeaders.set("x-is-applebot", "1")
    if (isBaiduCrawlerUA(ua)) requestHeaders.set("x-is-baiduspider", "1")
  }

  // Ranking ∪ social ∪ discovery → CrawlerSeoPage on SEO paths
  if (isCrawlerSeoPageUA(ua) && isSeoCrawlerPath(pathname)) {
    requestHeaders.set("x-crawler-seo-page", "1")
  }

  return requestHeaders
}

/** Only HTML next() helper — preserves crawler headers + RSC cookie bridge. */
function nextWithHeaders(requestHeaders: Headers): NextResponse {
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (requestHeaders.get("x-crawler-seo-page") === "1") {
    response.headers.set("x-crawler-seo-page", "1")
    response.cookies.set("x-crawler-seo-page", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60,
      sameSite: "lax",
    })
  }
  const pathname = requestHeaders.get("x-pathname") ?? ""
  if (
    pathname &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    applyNavProofCookie(response)
  }
  if (pathname && shouldApplyNoindexHeader(pathname)) {
    response.headers.set("X-Robots-Tag", NON_INDEXABLE_HEADER_VALUE)
  }
  return response
}

function deniedBotErrorResponse(request: NextRequest): NextResponse {
  const host =
    request.headers.get("host")?.split(":")[0] ||
    (() => {
      try {
        return new URL(SITE_URL).hostname
      } catch {
        return "this site"
      }
    })()

  return new NextResponse(buildErrorScreenHtml(host), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}

function handleGeoRegionRedirectIfNeeded(
  request: NextRequest,
  requestHeaders: Headers,
): NextResponse | null {
  const { pathname } = request.nextUrl

  if (pathname === "/geo-restricted" || pathname.startsWith("/geo-restricted/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    const res = NextResponse.redirect(url)
    res.cookies.set("geo_us_block", "1", { path: "/", maxAge: 120, sameSite: "lax" })
    return res
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return null
  }
  if (
    PUBLIC_BRAND_ASSETS.has(pathname) ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    isUngatedSeoPath(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return null
  }

  const userAgent = request.headers.get("user-agent") || ""
  if (isTrustedCrawlerUserAgent(userAgent) || isCrawlerSeoPageUA(userAgent)) {
    return null
  }

  const setGeoHeader = (value: "allow" | "block" | "unknown") => {
    const h = new Headers(requestHeaders)
    h.set(GEO_US_ONLY_HEADER, value)
    return nextWithHeaders(h)
  }

  if (request.cookies.get("geo_us_block")?.value === "1") {
    const h = new Headers(requestHeaders)
    h.set(GEO_US_ONLY_HEADER, "block")
    const res = nextWithHeaders(h)
    res.cookies.delete("geo_us_block")
    return res
  }

  const country = getRequestCountryCode(request)

  if (country && country !== "US") {
    return setGeoHeader("block")
  }

  if (!country) {
    return setGeoHeader("unknown")
  }

  return setGeoHeader("allow")
}

const STRICT_BLOCKED_BOT_PATTERNS = [
  /curl/i,
  /wget/i,
  /httpclient/i,
  /python-requests/i,
  /axios/i,
  /okhttp/i,
  /libwww-perl/i,
  /go-http-client/i,
  /\bjava\b/i,
  /\bphp\b/i,
]

const SOFT_BLOCKED_BOT_PATTERNS = [/bot/i, /crawler/i, /spider/i, /scraper/i]

async function handleBotIfNeeded(
  request: NextRequest,
  requestHeaders: Headers,
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get("user-agent") || ""

  if (!userAgent) {
    return null
  }

  // Competitive SEO + security scanners → SSR ErrorScreen (no JS / no login HTML)
  if (isDeniedBotUserAgent(userAgent)) {
    if (PUBLIC_BRAND_ASSETS.has(pathname) || pathname === "/error-icon.png") {
      return nextWithHeaders(requestHeaders)
    }
    return deniedBotErrorResponse(request)
  }

  const strictMatch = STRICT_BLOCKED_BOT_PATTERNS.some((p) => p.test(userAgent))
  const softMatch = SOFT_BLOCKED_BOT_PATTERNS.some((p) => p.test(userAgent))

  if (!strictMatch && !softMatch) {
    return null
  }

  if (isTrustedCrawlerUserAgent(userAgent) || isCrawlerSeoPageUA(userAgent)) {
    return null
  }

  // robots/sitemap/brand assets must stay reachable for any client (not ErrorScreen HTML)
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_BRAND_ASSETS.has(pathname) ||
    isUngatedSeoPath(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return nextWithHeaders(requestHeaders)
  }

  // Soft unknown bots on `/` (and other HTML): cloak — no human login HTML
  if (softMatch && !strictMatch) {
    return deniedBotErrorResponse(request)
  }

  if (strictMatch) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  return null
}

/** Optional: redirect www vs apex to SITE_URL hostname. */
function handlePreferredHostRedirect(request: NextRequest): NextResponse | null {
  if (isLocalTestingUnlocked()) return null
  const rawHost = request.headers.get("host")?.split(":")[0]?.toLowerCase()
  if (!rawHost || rawHost === "localhost" || rawHost.endsWith(".localhost")) return null

  let preferred: URL
  try {
    preferred = new URL(SITE_URL)
  } catch {
    return null
  }
  const preferredHost = preferred.hostname.toLowerCase()
  if (rawHost === preferredHost) return null

  const preferredApex = preferredHost.replace(/^www\./, "")
  const currentApex = rawHost.replace(/^www\./, "")
  if (currentApex !== preferredApex) return null

  const target = request.nextUrl.clone()
  target.hostname = preferredHost
  target.protocol = preferred.protocol
  return NextResponse.redirect(target, 308)
}


function handleRiskCookieIfNeeded(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api/bot-fingerprint")) return null
  if (pathname.startsWith("/api/bot-honeypot")) return null
  if (pathname.startsWith("/_next")) return null
  if (typeof PUBLIC_BRAND_ASSETS !== "undefined" && PUBLIC_BRAND_ASSETS.has(pathname)) return null
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    (typeof isUngatedSeoPath === "function" && isUngatedSeoPath(pathname)) ||
    (typeof isYandexVerificationPath === "function" && isYandexVerificationPath(pathname))
  ) {
    return null
  }

  const userAgent = request.headers.get("user-agent") || ""
  if (
    (typeof isTrustedCrawlerUserAgent === "function" && isTrustedCrawlerUserAgent(userAgent)) ||
    (typeof isCrawlerSeoPageUA === "function" && isCrawlerSeoPageUA(userAgent))
  ) {
    return null
  }

  const risk = readRiskCookie(request)
  if (!risk || !isMitigationBand(risk.band)) return null

  if (pathname.startsWith("/api")) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  return deniedBotErrorResponse(request)
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl
  const requestHeaders = applySearchCrawlerHeaders(request)

  if (!isLocalTestingUnlocked()) {
    notifyBotCrawlIfNeeded(request, event)
  }

  if (isLocalTestingUnlocked()) {
    return nextWithHeaders(requestHeaders)
  }

  const hostRedirect = handlePreferredHostRedirect(request)
  if (hostRedirect) {
    return hostRedirect
  }

  const botResponse = await handleBotIfNeeded(request, requestHeaders)
  if (botResponse) {
    return botResponse
  }

  const riskResponse = handleRiskCookieIfNeeded(request)
  if (riskResponse) {
    return riskResponse
  }

  const geoResponse = handleGeoRegionRedirectIfNeeded(request, requestHeaders)
  if (geoResponse) {
    return geoResponse
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_BRAND_ASSETS.has(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return nextWithHeaders(requestHeaders)
  }

  return nextWithHeaders(requestHeaders)
}

export const config = {
  matcher: [
    // If using a custom OG filename (not /og-image.png), add it to SEO_ALLOWED_PATHS,
    // PUBLIC_BRAND_ASSETS, and this negative-lookahead (same basename as in public/).
    "/((?!_next/static|_next/image|error-icon\\.png|favicon\\.ico|favicon\\.png|icon-48x48\\.png|icon-32x32\\.png|apple-touch-icon\\.png|og-image\\.png|yandex_[0-9a-f]+\\.html).*)",
  ],
}
