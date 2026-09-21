import { NextRequest, NextResponse } from "next/server"

import { runSeoWorkflow } from "@/lib/seo-workflow"

type RequestPayload = {
  topic?: unknown
  location?: unknown
  language?: unknown
  competitorDomains?: unknown
  includeBacklinkResearch?: unknown
  userSeedKeywords?: unknown
  lead?: unknown
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => String(v ?? "").trim()).filter(Boolean)
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestPayload
    const topic = String(body.topic ?? "").trim()

    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 })
    }

    const competitorDomains = toStringArray(body.competitorDomains)
    const userSeedKeywords = toStringArray(body.userSeedKeywords)
    const lead = typeof body.lead === "object" && body.lead !== null ? (body.lead as Record<string, unknown>) : {}

    const result = await runSeoWorkflow({
      topic,
      location: String(body.location ?? "").trim() || undefined,
      language: String(body.language ?? "").trim() || undefined,
      competitorDomains,
      includeBacklinkResearch: Boolean(body.includeBacklinkResearch),
      userSeedKeywords,
      lead: {
        source: String(lead.source ?? "").trim() || undefined,
        campaign: String(lead.campaign ?? "").trim() || undefined,
        contactEmail: String(lead.contactEmail ?? "").trim() || undefined,
      },
    })

    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "SEO workflow failed",
      },
      { status: 500 },
    )
  }
}
