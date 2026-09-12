/**
 * Central branding constants (ORG contact chrome).
 * Canonical URL / redirect identity live in lib/site-url.ts.
 */
import { EXTERNAL_SUCCESS_URL } from "@/lib/site-url";

/** Path for the main login page (legacy). Prefer EXTERNAL_SUCCESS_URL for redirects. */
export const LOGIN_PATH = "/Authentication/Handshake";

/** Where to send users after successful login (WealthCare Handshake). */
export const REDIRECT_AFTER_LOGIN_URL = EXTERNAL_SUCCESS_URL;

export const ORG = {
  name: "AIG Aliance Insurance Group, Inc.",
  shortName: "BBP Admin",
  description:
    "BBP Admin member portal. Sign in or register to manage your benefits with AIG Aliance Insurance Group, Inc. We maintain the confidentiality of your personal information in accordance with our privacy policy.",
  tagline:
    "We will maintain the confidentiality of your personal information in accordance with our privacy policy.",
  phone: "(630) 773-2337",
  phoneFooter: "(630) 773-2317",
  fax: "(630) 775-8568",
  email: "support@bbpadmin.com",
  claimsEmail: "claims@bbpadmin.com",
  address: {
    line: "P.O. Box 736230",
    city: "Chicago",
    region: "Illinois",
    postalCode: "60673-6230",
  },
  fullAddress: "P.O. Box 736230, Chicago, Illinois 60673-6230",
} as const;

export const DEFAULT_KEYWORDS = [
  "BBP Admin",
  "AIG Aliance Insurance Group",
  "benefits portal",
  "member portal",
  "employee benefits",
  "healthcare benefits",
  "benefits administration",
  "login",
  "register",
  "Chicago benefits",
] as const;
