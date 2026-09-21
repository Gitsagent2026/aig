import {
  buildSiteKeywords,
  CRAWLER_RELATED_SEARCHES,
  PAGE_H1_HEADING,
} from "@/lib/seo-keywords";

/** ≥15 characters for Bing / SEO tools. */
export const SITE_TITLE = "AIG Aliance Insurance Group - Login to Your Account";

export const SITE_DESCRIPTION =
  "Alliance Insurance Group benefits portal login for WealthCare HSA, FSA, and HRA accounts. Sign in securely to manage reimbursement and participant benefits online.";

export const SITE_KEYWORDS: string[] = buildSiteKeywords();
export { CRAWLER_RELATED_SEARCHES };

export { PAGE_H1_HEADING };

export const LAYOUT_DESCRIPTION = SITE_DESCRIPTION;

/** Live SERP-style default title used by some audits / docs (≥15 chars). */
export const SERP_DEFAULT_TITLE = SITE_TITLE;
