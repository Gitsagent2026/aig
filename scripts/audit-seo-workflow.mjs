#!/usr/bin/env node

/**
 * SEO workflow guardrails:
 * - Ensure optional DataForSEO integration path exists
 * - Ensure no hard-coded credentials
 * - Ensure optional GA hook is env-gated
 */

import { readFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.join(import.meta.dirname, "..")

async function read(relPath) {
  return readFile(path.join(ROOT, relPath), "utf8")
}

function fail(message) {
  console.error(`SEO workflow audit failed: ${message}`)
  process.exit(1)
}

async function main() {
  const seoWorkflow = await read("lib/seo-workflow.ts")
  const seoRoute = await read("app/api/seo/workflow/route.ts")
  const gaComponent = await read("components/google-analytics.tsx")

  if (!seoWorkflow.includes("DATAFORSEO_LOGIN") || !seoWorkflow.includes("DATAFORSEO_PASSWORD")) {
    fail("DataForSEO credentials env path is missing.")
  }

  if (!seoWorkflow.includes("SEO_CRM_WEBHOOK_URL")) {
    fail("Optional CRM webhook env path is missing.")
  }

  if (/DATAFORSEO_(LOGIN|PASSWORD)\s*=\s*["'][^"']+["']/.test(seoWorkflow)) {
    fail("Detected hard-coded DataForSEO credential value.")
  }

  if (!seoRoute.includes("topic is required")) {
    fail("SEO workflow route input validation appears incomplete.")
  }

  if (!gaComponent.includes("NEXT_PUBLIC_GA_MEASUREMENT_ID")) {
    fail("Google Analytics env gating is missing.")
  }

  if (!gaComponent.includes("anonymize_ip")) {
    fail("Google Analytics privacy configuration is missing anonymize_ip.")
  }

  console.log("SEO workflow audit passed.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
