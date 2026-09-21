# AIG Application

## SEO Workflow (AI-assisted, optional integrations)

This repository includes an optional SEO workflow API at:

- `POST /api/seo/workflow`

It is designed to support research-driven SEO workflows without hard-coded credentials:

- **Keyword research provider abstraction**
  - Uses DataForSEO when configured.
  - Safe fallback when credentials are missing (no fabricated provider data).
- **Competitor/backlink workflow boundaries**
  - Accepts competitor domains and backlink intent.
  - Marks these blocks as unsupported until a dedicated provider is configured.
- **AI-assisted brief generation**
  - Produces a structured SEO content brief from available research data.
- **Optional CRM lead hook**
  - Sends lead-conversion signals only when configured.

### Request body (example)

```json
{
  "topic": "hsa account login help",
  "location": "United States",
  "language": "English",
  "competitorDomains": ["example.com"],
  "includeBacklinkResearch": true,
  "userSeedKeywords": ["benefits portal login"],
  "lead": {
    "source": "organic",
    "campaign": "seo-brief-q4",
    "contactEmail": "owner@example.com"
  }
}
```

### Environment variables

#### Optional DataForSEO integration

- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`
- `DATAFORSEO_BASE_URL` (optional, defaults to `https://api.dataforseo.com`)

If DataForSEO credentials are not set, the workflow reports `not_configured` for provider-backed keyword data.

#### Optional analytics (privacy-conscious)

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (format: `G-XXXXXXXXXX`)

Google Analytics is only enabled when this value is present and valid. Configuration includes:

- `allow_google_signals: false`
- `allow_ad_personalization_signals: false`

#### Optional CRM hook

- `SEO_CRM_WEBHOOK_URL`

When configured, the workflow sends a `seo_lead_signal` payload to this endpoint. When not configured, it safely reports `not configured`.

## SEO fundamentals currently in app

- Canonical URL metadata
- Open Graph and Twitter metadata
- Structured data (`WebSite`, `WebPage`)
- Dynamic `robots.txt` route
- Sitemap generation support
