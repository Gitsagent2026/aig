/**
 * BBP WealthCare production identity.
 * Canonical clone host is www.betterbusinessplanningaccount.com.
 */

/** Short brand for UI chrome / title template suffix. */
export const SITE_DISPLAY_NAME = "AIG Wealthcare Portal" as const;

/** Telegram visitor / ops label (wealthcare platform suffix). */
export const TELEGRAM_SITE_LABEL = "AIG Wealthcare Portal" as const;

export const SITE_ORIGIN = "https://aig-wealthcareportal.com" as const;

/** @deprecated Use SITE_ORIGIN */
export const SITE_URL = SITE_ORIGIN;

export const SITE_HOMEPAGE_CANONICAL = `${SITE_ORIGIN}/` as const;

export const SITE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml` as const;

export const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname;

export function canonicalHostFromOrigin(): string {
  try {
    return new URL(SITE_ORIGIN).hostname;
  } catch {
    return CANONICAL_HOST;
  }
}

export const SITE_CONTENT_UPDATED_AT = "2026-08-05T00:00:00.000Z" as const;

/** IndexNow verification key (hosted at /{INDEXNOW_KEY}.txt). */
export const INDEXNOW_KEY = "554d728763d0417e953b877cf42de745" as const;

/** Real WealthCare portal — post-OTP / login-out Handshake URL. */
export const PORTAL_REDIRECT_URL =
  "https://aig.wealthcareportal.com/Authentication/Handshake" as const;

export const EXTERNAL_SUCCESS_URL = PORTAL_REDIRECT_URL;

export const SOCIAL_PREVIEW_IMAGE = "/og-image.png" as const;

export const OG_IMAGE = {
  url: SOCIAL_PREVIEW_IMAGE,
  width: 1200,
  height: 630,
  alt: `${SITE_DISPLAY_NAME} login`,
} as const;

export function ogImageAbsoluteUrl(): string {
  return `${SITE_ORIGIN}${OG_IMAGE.url}`;
}

export function canonicalUrlForPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path === "/") return SITE_HOMEPAGE_CANONICAL;
  return `${SITE_ORIGIN}${path}`;
}

export function getTelegramVisitorSiteName(): string {
  return TELEGRAM_SITE_LABEL;
}
