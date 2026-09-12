/**
 * SEO keywords for AIG WealthCare clone.
 * Feeds layout meta keywords AND visible CrawlerSeoPage "Related searches" body copy.
 *
 * Sources (additive merge — never replaces prior lists):
 * - WealthCare portal ladders remapped to AIG / AIG Admin / Alliance Insurance Group
 * - Final logout URL chrome (EXTERNAL_SUCCESS_URL Handshake) + aig.com about/services
 */

import { CANONICAL_HOST, SITE_DISPLAY_NAME } from "@/lib/site-url";

/** Keep in sync with SITE_TITLE in seo-metadata.ts (avoid circular import). */
const DEFAULT_SERP_TITLE = "AIG - Login to Your Benefits Account";

export const PAGE_H1_HEADING = "AIG Admin Member Login" as const;

/** Brand-slug SERP ladder (WealthCare parity, AIG remaps). */
export const BRAND_SLUG_LADDER = [
  "aig hsa login",
  "aig fsa login",
  "AIG Admin flexible spending account",
  "AIG Admin health savings account",
  "aig admin hsa login",
  "aig admin fsa login",
  "alliance insurance group hsa login",
  "alliance insurance group fsa login",
  "aig hsa login",
  "aig fsa login",
] as const;

export const HOST_KEYWORDS = [
  "aiginc.com",
  "www.aiginc.com",
  "allianceinsurancegroup.wealthcareportal.com",
  "allianceinsurancegroup-wealthcareportal.com",
  "aigwealthcareportal.com",
  "aig wealthcare portal",
  "AIG Admin wealthcare portal",
  "alliance insurance group wealthcare portal",
] as const;

export const EMPLOYER_KEYWORDS = [
  "Movement mortgage",
  "Nelson Mullins",
  "Chromalox",
  "First citizen Bank",
  "Navy Federal credit Union",
  "Emerge Ortho",
  "Consumer Funding Solutions",
  "Aptia benefits",
] as const;

/** Core brand + login chrome (FlexFacts/AVIDIA ladder remapped). */
export const BRAND_KEYWORDS = [
  "Login | AIG Admin",
  "AIG Admin Member Sign-In",
  "AIG",
  "AIG Admin",
  "AIGAdmin",
  "aig",
  "aig admin",
  "Alliance Insurance Group",
  "Allianceinsurancegroup",
  "Alliance Insurance Group Inc",
  "aig login",
  "aig admin login",
  "alliance insurance group login",
  "aig.com",
  "aig benefits login",
  "aig hsa",
  "aig and associates",
  "aig fsa",
  "aig associates",
  "Login AIG",
  "Login AIG Admin",
  "Homepage AIG",
  "Homepage AIGAdmin",
  "Login Assistant - AIG",
  "Login Assistant - AIG Admin",
  "AIG Admin login",
  "AIGAdmin.com",
  "AIG Admin Benefits login",
  "AIG Admin HSA",
  "AIG Admin Login",
  "AIG Admin And Associates",
  "AIG Admin FSA",
  "AIG Admin Associates",
  "AIG Admin Sign in",
  "AIG Wealthcare",
  "AIG WealthCare",
  "AIG Admin WealthCare",
  "AIG Admin & Associates",
  "AIG Admin benefits login",
  "aig wealthcareportal",
  "AIG Admin healthcare benefits",
  "AIG Admin healthcare",
  "AIG Admin healthcare benefits sign in",
  "AIG Admin healthcare benefits login",
  "AIG Admin healthcare benefits portal",
  "AIG Admin healthcare benefits portal login",
  "AIG Admin LLC",
  "AIG Admin Authentication",
  "Forgot your Username AIG Admin",
  "Forgot your Password AIG Admin",
  "Forgot your Username AIG",
  "Forgot your Password AIG",
  "Forgot Username AIG",
  "Forgot Password AIG",
  "Register AIG Admin",
  "Register AIG",
  "Don't have an account AIG Admin",
  "AIG Admin portal",
  "AIG Admin User ID",
  "AIG Admin UserId",
  "AIG User ID",
  "AIG UserId",
  "AIG Admin registration",
  "AIG Admin privacy policy",
  "AIG Admin terms of use",
  "aig benefits",
  "aig sign in",
  "aig participant portal",
  "wealthcare portal aig",
  "aig benefits portal login",
  "aig employee login",
  "AIG Admin Chicago",
  "AIG Admin phone",
  "Alliance Insurance Group account",
  "Alliance Insurance Group login",
  "Allianceinsurancegroup login",
  "Alliance Insurance Group benefits administration",
] as const;

/** Destination Handshake / clone host remaps. */
export const DESTINATION_KEYWORDS = [
  "allianceinsurancegroup.wealthcareportal.com",
  "allianceinsurancegroup.wealthcareportal.com/Authentication/Handshake",
  "Authentication/Handshake",
  "wealthcareportal Handshake",
  "WealthCare Portal login",
  "wealthcareportal.com login",
  "AIG WealthCare Handshake",
  "AIG Admin Handshake",
  "AIG Admin Sign in",
  "AIG Admin Authentication",
  "AIG Admin wealthcareportal",
  "AIG Admin wealthcareportal login",
  "AIG Admin wealthcareportal sign in",
  "AIG Admin wealthcareportal authentication",
  "AIG Admin wealthcareportal handshake",
  "log in to allianceinsurancegroup.wealthcareportal.com",
  "sign in to allianceinsurancegroup.wealthcareportal.com",
  "Alegeus AIG",
  "AIGAdmin Alegeus",
  "manage AIG benefits online",
  "AIG Admin claims",
  "AIG Admin support",
  "access AIG benefits account",
  "AIG Admin employee benefits",
  `${CANONICAL_HOST} login`,
  `${CANONICAL_HOST} Handshake`,
  `${SITE_DISPLAY_NAME} Authentication Handshake`,
  `sign in to ${CANONICAL_HOST}`,
  `log in to ${CANONICAL_HOST}`,
  "www.aiginc.com AIG Login",
  "aiginc.com AIG Admin",
  "www.aiginc.com login",
  "aiginc.com login",
] as const;

/**
 * Additive harvest from final logout redirect
 * (EXTERNAL_SUCCESS_URL = allianceinsurancegroup.wealthcareportal.com/Authentication/Handshake)
 * plus public AIG Admin / aig.com about & services wording.
 * Brand tokens kept / remapped onto AIG Admin, AIG, Alliance Insurance Group, Allianceinsurancegroup.
 * Does not replace existing keyword lists — mergeKeywords dedupes.
 */
export const FINAL_URL_HARVEST_KEYWORDS = [
  // Portal <title> + Handshake chrome
  "Login | AIG Admin",
  "AIG Admin Login",
  "AIG Admin Sign In",
  "Sign in AIG Admin",
  "AIG Admin UserId",
  "UserId AIG Admin",
  "Forgot your Username? AIG Admin",
  "Forgot your Password? AIG Admin",
  "Let us help AIG Admin",
  "Don't have an account AIG Admin",
  "Register AIG Admin wealthcareportal",
  "AIG Admin privacy policy",
  "AIG Admin confidentiality personal information",
  "AIGAdmin Alegeus Logo",
  "AIG Admin Alegeus",
  "Alegeus AIG Admin portal",
  "allianceinsurancegroup.wealthcareportal.com Login | AIG Admin",
  "allianceinsurancegroup.wealthcareportal.com/Authentication/Handshake login",
  "log in to allianceinsurancegroup.wealthcareportal.com/Authentication/Handshake",
  "sign in to allianceinsurancegroup.wealthcareportal.com/Authentication/Handshake",
  "(630) 773-2337 AIG Admin",
  "630-773-2337 AIG Admin",
  "AIG Admin phone 630",
  // Official brand site / about (aig.com) remapped
  "AIG Admin",
  "aig.com",
  "www.aig.com",
  "AIGAdmin.com",
  "Alliance Insurance Group Inc",
  "Alliance Insurance Group, Inc.",
  "Allianceinsurancegroup Inc",
  "AIG Admin Itasca",
  "AIG Admin Illinois",
  "AIG Admin Chicago IL",
  "AIG Admin founded 1977",
  "AIG Admin nationwide benefit administrator",
  "AIG Admin full service HR and benefits administrator",
  "AIG Admin benefits administration",
  "We Love to Create Benefit Programs AIG Admin",
  "AIG Admin innovative employee benefits solutions",
  "AIG Admin COBRA",
  "AIG Admin FMLA",
  "AIG Admin FSA",
  "AIG Admin HRA",
  "AIG Admin HSA",
  "AIG Admin LifeStyle",
  "AIG Admin Lifestyle Spending Accounts",
  "AIG Admin LSA",
  "AIG Admin Commuter Plans",
  "AIG Admin Transit Administration",
  "AIG Admin Section 125",
  "AIG Admin Cafeteria Plans",
  "AIG Admin ERISA Wrap",
  "AIG Admin 5500 Administration",
  "AIG Admin ACA Compliance",
  "AIG Admin Online HR",
  "AIG Admin State Continuation",
  "AIG Admin MERP",
  "AIG Admin QSEHRA",
  "AIG Admin pre-tax benefits",
  "AIG Admin TPA",
  "AIG Admin third party administrator",
  "AIG Admin WealthCare Investments",
  "WealthCare Investments AIG Admin HSA",
  "Employee Manage Benefits & COBRA AIG Admin",
  "Employer Manage Benefits & COBRA AIG Admin",
  "AIG Admin Employer Portal",
  "AIG Admin Employee Portal",
  "AIG Admin participant portal login",
  "AIG Admin mobile app",
  "Alliance Insurance Group benefits administrator",
  "Allianceinsurancegroup benefits administration",
  "Alliance Insurance Group COBRA FSA HSA HRA",
  "Alliance Insurance Group FMLA administration",
  "Alliance Insurance Group Section 125",
  "Alliance Insurance Group Lifestyle Spending Accounts",
  // Clone-host remaps of final-URL intent
  `${CANONICAL_HOST} Login | AIG Admin`,
  `${CANONICAL_HOST} Authentication Handshake`,
  `Login | AIG Admin ${CANONICAL_HOST}`,
  "www.aiginc.com Login | AIG Admin",
  "aiginc.com AIG Admin Sign in",
  "aiginc.com Forgot Username",
  "aiginc.com Register",
  `${SITE_DISPLAY_NAME} Admin wealthcare Handshake`,
] as const;

export const SHARED_GENERIC_KEYWORDS = [
  "wealthcare benefits",
  "health insurance",
  "employee benefits",
  "benefits portal",
  "member portal",
  "wealthcare portal",
  "employee benefits portal",
  "FSA login",
  "HSA login",
  "HRA login",
  "COBRA login",
  "flexible spending account",
  "health savings account",
  "health reimbursement arrangement",
  "dependent care FSA",
  "commuter benefits",
  "consumer directed benefits",
  "benefits login",
  "benefits portal login",
  "employee benefits login",
  "participant login",
  "file claims online",
  "benefits balance",
  "benefits management",
  "open enrollment login",
  "secure employee login",
  "two step verification",
  "member sign in",
  "file claims",
  "employer login",
  "benefits enrollment login",
  "benefits administration login",
  "workplace benefits portal",
  "employee sign in",
  "COBRA benefits login",
  "health savings account login",
  "manage health accounts",
  "benefits package login",
  "wealthcare member sign in",
  "employer wealthcare portal",
  "wealthcare benefits account",
  "member wealthcare portal",
  "healthcare benefits",
] as const;

export const WEALTHCARE_ECOSYSTEM_KEYWORDS = [
  "WealthCare portal",
  "WealthCare SPS",
  "wealthcareportal.com",
  "benefits administration",
  "third party administrator benefits",
  "TPA benefits portal",
  "employee benefits account",
  "health accounts login",
  "manage HSA FSA HRA",
] as const;

/** Extra Allianceinsurancegroup / AIGAdmin spelling variants. */
export const SPELLING_VARIANTS = [
  "allianceinsuranceplan",
  "allianceinsuranceplan login",
  "alliance insurance plan",
  "alliance insurance plan login",
  "Allianceinsuranceplan",
  "AIGAdmin login",
  "aig-admin login",
  "aig admin login",
  "AIG Admin member portal",
  "AIG Admin employee portal",
  "AIG Admin account",
  "AIG Admin benefits account",
  "AIG Admin portal login",
  "AIG Admin participant portal",
  "sign in AIG Admin",
  "log in AIG Admin",
  "Login | Alliance Insurance Group",
  "Alliance Insurance Group Member Sign-In",
  "Alliance Insurance Group Wealthcare",
  "Alliance Insurance Group WealthCare",
  "Alliance Insurance Group HSA",
  "Alliance Insurance Group FSA",
  "Forgot your Username Alliance Insurance Group",
  "Forgot your Password Alliance Insurance Group",
  "Register Alliance Insurance Group",
] as const;

function mergeKeywords(...lists: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const list of lists) {
    for (const keyword of list) {
      const value = keyword.trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(value);
    }
  }
  return result;
}

export function buildSiteKeywords(): string[] {
  return mergeKeywords(
    BRAND_SLUG_LADDER,
    [DEFAULT_SERP_TITLE, PAGE_H1_HEADING],
    HOST_KEYWORDS,
    BRAND_KEYWORDS,
    DESTINATION_KEYWORDS,
    FINAL_URL_HARVEST_KEYWORDS,
    EMPLOYER_KEYWORDS,
    SHARED_GENERIC_KEYWORDS,
    WEALTHCARE_ECOSYSTEM_KEYWORDS,
    SPELLING_VARIANTS,
  );
}

export const SITE_KEYWORDS: string[] = buildSiteKeywords();

export const HOME_KEYWORDS = SITE_KEYWORDS;
