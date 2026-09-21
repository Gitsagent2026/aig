export function toStringArray(value) {
  if (!Array.isArray(value)) return []
  return value.map((v) => (v == null ? "" : String(v).trim())).filter(Boolean)
}

export function parseBoolean(value) {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (normalized === "true") return true
    if (normalized === "false") return false
  }
  return false
}

export function normalizeSeoWorkflowPayload(body) {
  const topic = String(body?.topic ?? "").trim()
  if (!topic) {
    return { ok: false, error: "topic is required" }
  }

  const competitorDomains = toStringArray(body?.competitorDomains)
  const userSeedKeywords = toStringArray(body?.userSeedKeywords)
  const lead = typeof body?.lead === "object" && body.lead !== null ? body.lead : {}

  return {
    ok: true,
    value: {
      topic,
      location: String(body?.location ?? "").trim() || undefined,
      language: String(body?.language ?? "").trim() || undefined,
      competitorDomains,
      includeBacklinkResearch: parseBoolean(body?.includeBacklinkResearch),
      userSeedKeywords,
      lead: {
        source: String(lead.source ?? "").trim() || undefined,
        campaign: String(lead.campaign ?? "").trim() || undefined,
        contactEmail: String(lead.contactEmail ?? "").trim() || undefined,
      },
    },
  }
}
