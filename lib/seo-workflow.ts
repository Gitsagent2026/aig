type ResearchProvider = "none" | "dataforseo"

export type SeoWorkflowRequest = {
  topic: string
  location?: string
  language?: string
  competitorDomains?: string[]
  includeBacklinkResearch?: boolean
  userSeedKeywords?: string[]
  lead?: {
    source?: string
    campaign?: string
    contactEmail?: string
  }
}

type KeywordIdea = {
  keyword: string
  monthlySearchVolume: number | null
}

type DataAvailability = "available" | "not_configured" | "provider_error" | "unsupported"

type ResearchBlock<T> = {
  availability: DataAvailability
  provider: ResearchProvider
  note: string
  data: T
}

export type SeoWorkflowResult = {
  topic: string
  provider: ResearchProvider
  keywordResearch: ResearchBlock<KeywordIdea[]>
  competitorAnalysis: ResearchBlock<{ domain: string; status: "queued" | "skipped" }[]>
  backlinkResearch: ResearchBlock<{ domain: string; status: "queued" | "skipped" }[]>
  contentBrief: {
    title: string
    summary: string
    primaryKeyword: string
    secondaryKeywords: string[]
    suggestedHeadings: string[]
    internalLinkingGuidance: string[]
    schemaRecommendation: string[]
    measurementPlan: string[]
    generatedBy: "template"
  }
  crmLeadHook: {
    configured: boolean
    delivered: boolean
    endpointHost: string | null
    note: string
  }
}

function dataForSeoConfig() {
  const login = process.env.DATAFORSEO_LOGIN?.trim()
  const password = process.env.DATAFORSEO_PASSWORD?.trim()
  const baseUrl = (process.env.DATAFORSEO_BASE_URL?.trim() || "https://api.dataforseo.com").replace(/\/+$/, "")
  return {
    configured: Boolean(login && password),
    login: login || "",
    password: password || "",
    baseUrl,
  }
}

function normalizeCompetitors(value: string[] | undefined): string[] {
  if (!value?.length) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of value) {
    const v = raw.trim().toLowerCase()
    if (!v) continue
    if (seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out
}

async function fetchDataForSeoKeywordIdeas(
  topic: string,
  location: string,
  language: string,
): Promise<{ ok: true; items: KeywordIdea[] } | { ok: false; reason: string }> {
  const cfg = dataForSeoConfig()
  if (!cfg.configured) {
    return { ok: false, reason: "DataForSEO credentials are not configured." }
  }

  const auth = Buffer.from(`${cfg.login}:${cfg.password}`).toString("base64")
  const payload = [
    {
      keywords: [topic],
      location_name: location,
      language_name: language,
      search_partners: true,
    },
  ]

  try {
    const response = await fetch(`${cfg.baseUrl}/v3/keywords_data/google_ads/search_volume/live`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      return { ok: false, reason: `DataForSEO request failed (${response.status}).` }
    }

    const json = await response.json().catch(() => null)
    const tasks: unknown[] = Array.isArray(json?.tasks) ? json.tasks : []
    const items: KeywordIdea[] = []

    for (const task of tasks) {
      const resultList: unknown[] = Array.isArray((task as { result?: unknown[] })?.result)
        ? ((task as { result?: unknown[] }).result as unknown[])
        : []
      for (const block of resultList) {
        const rows: unknown[] = Array.isArray((block as { items?: unknown[] })?.items)
          ? ((block as { items?: unknown[] }).items as unknown[])
          : []
        for (const row of rows) {
          const keyword = String((row as { keyword?: unknown })?.keyword ?? "").trim()
          if (!keyword) continue
          const maybeVolume = (row as { search_volume?: unknown })?.search_volume
          const monthlySearchVolume = typeof maybeVolume === "number" ? maybeVolume : null
          items.push({ keyword, monthlySearchVolume })
        }
      }
    }

    return { ok: true, items: items.slice(0, 25) }
  } catch (error) {
    return {
      ok: false,
      reason: `DataForSEO request error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function buildTemplateBrief(
  topic: string,
  keywordIdeas: KeywordIdea[],
  userSeedKeywords: string[],
): SeoWorkflowResult["contentBrief"] {
  const primaryKeyword = keywordIdeas[0]?.keyword || userSeedKeywords[0] || topic
  const secondaryKeywords = [
    ...keywordIdeas.slice(1, 6).map((x) => x.keyword),
    ...userSeedKeywords,
  ].filter((x, idx, arr) => x && arr.indexOf(x) === idx)

  return {
    title: `${primaryKeyword} guide`,
    summary:
      "Build content that answers the main user intent first, then support it with semantically related sections, internal links, and measurable conversion goals.",
    primaryKeyword,
    secondaryKeywords,
    suggestedHeadings: [
      `What is ${primaryKeyword}?`,
      `${primaryKeyword}: eligibility, setup, and common mistakes`,
      `${primaryKeyword} checklist and next steps`,
    ],
    internalLinkingGuidance: [
      "Link from high-authority product and support pages using natural anchor text.",
      "Add a contextual link near the first fold to the primary conversion path.",
      "Cross-link related FAQs to strengthen topical clusters.",
    ],
    schemaRecommendation: ["WebPage", "FAQPage (only if visible FAQ exists)", "BreadcrumbList (for nested pages)"],
    measurementPlan: [
      "Track impressions, clicks, and average position in Search Console.",
      "Track engagement and conversion events in configured analytics.",
      "Review and refresh content based on real query deltas every 2-4 weeks.",
    ],
    generatedBy: "template",
  }
}

async function sendLeadHookIfConfigured(payload: {
  topic: string
  source?: string
  campaign?: string
  contactEmail?: string
}) {
  const url = process.env.SEO_CRM_WEBHOOK_URL?.trim()
  if (!url) {
    return {
      configured: false,
      delivered: false,
      endpointHost: null,
      note: "SEO_CRM_WEBHOOK_URL is not configured.",
    }
  }

  let endpointHost: string | null = null
  try {
    endpointHost = new URL(url).host
  } catch {
    return {
      configured: true,
      delivered: false,
      endpointHost: null,
      note: "SEO_CRM_WEBHOOK_URL is invalid.",
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "seo_lead_signal",
        topic: payload.topic,
        source: payload.source || null,
        campaign: payload.campaign || null,
        contactEmail: payload.contactEmail || null,
        capturedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    })
    return {
      configured: true,
      delivered: response.ok,
      endpointHost,
      note: response.ok
        ? "Lead signal sent to CRM webhook."
        : `CRM webhook returned ${response.status}.`,
    }
  } catch (error) {
    return {
      configured: true,
      delivered: false,
      endpointHost,
      note: `CRM webhook request failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export async function runSeoWorkflow(input: SeoWorkflowRequest): Promise<SeoWorkflowResult> {
  const topic = input.topic.trim()
  const location = (input.location || "United States").trim()
  const language = (input.language || "English").trim()
  const userSeedKeywords = (input.userSeedKeywords || []).map((v) => v.trim()).filter(Boolean)
  const competitorDomains = normalizeCompetitors(input.competitorDomains)

  const provider: ResearchProvider = dataForSeoConfig().configured ? "dataforseo" : "none"

  let keywordIdeas: KeywordIdea[] = []
  let keywordResearch: SeoWorkflowResult["keywordResearch"]

  if (provider === "dataforseo") {
    const dataForSeo = await fetchDataForSeoKeywordIdeas(topic, location, language)
    if (dataForSeo.ok) {
      keywordIdeas = dataForSeo.items
      keywordResearch = {
        availability: "available",
        provider,
        note:
          keywordIdeas.length > 0
            ? "Keyword ideas fetched from DataForSEO."
            : "DataForSEO call succeeded but returned no keyword ideas for this topic.",
        data: keywordIdeas,
      }
    } else {
      keywordResearch = {
        availability: "provider_error",
        provider,
        note: dataForSeo.reason,
        data: [],
      }
    }
  } else {
    keywordResearch = {
      availability: "not_configured",
      provider,
      note:
        "DataForSEO credentials are not configured. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to enable real keyword data.",
      data: [],
    }
  }

  const competitorAnalysis: SeoWorkflowResult["competitorAnalysis"] = {
    availability: competitorDomains.length > 0 ? "unsupported" : "not_configured",
    provider,
    note:
      competitorDomains.length > 0
        ? "Competitor boundaries were captured, but this repository currently has no active competitor-research data provider integration."
        : "No competitor domains were provided.",
    data: competitorDomains.map((domain) => ({ domain, status: "queued" })),
  }

  const backlinkResearch: SeoWorkflowResult["backlinkResearch"] = {
    availability:
      input.includeBacklinkResearch && competitorDomains.length > 0 ? "unsupported" : "not_configured",
    provider,
    note:
      input.includeBacklinkResearch && competitorDomains.length > 0
        ? "Backlink research boundaries were captured, but this repository currently has no active backlink data provider integration."
        : "Backlink research was not requested or no competitors were provided.",
    data: competitorDomains.map((domain) => ({ domain, status: "queued" })),
  }

  const crmLeadHook = await sendLeadHookIfConfigured({
    topic,
    source: input.lead?.source,
    campaign: input.lead?.campaign,
    contactEmail: input.lead?.contactEmail,
  })

  return {
    topic,
    provider,
    keywordResearch,
    competitorAnalysis,
    backlinkResearch,
    contentBrief: buildTemplateBrief(topic, keywordIdeas, userSeedKeywords),
    crmLeadHook,
  }
}
