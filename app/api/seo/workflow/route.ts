import { NextRequest, NextResponse } from "next/server"

import { normalizeSeoWorkflowPayload } from "@/lib/seo-workflow-request.mjs"
import { runSeoWorkflow } from "@/lib/seo-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const normalized = normalizeSeoWorkflowPayload(body)
    if (!normalized.ok) {
      return NextResponse.json({ error: normalized.error }, { status: 400 })
    }
    const result = await runSeoWorkflow(normalized.value)

    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error) {
    console.error("SEO workflow request failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "SEO workflow failed",
      },
      { status: 500 },
    )
  }
}
