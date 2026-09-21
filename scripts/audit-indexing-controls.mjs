#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const root = path.resolve(process.argv[2] ?? process.cwd())

const failures = []

function extractExportedStringArray(source, exportName) {
  const match = source.match(
    new RegExp(
      `export\\s+const\\s+${exportName}\\s*=\\s*\\[(?<items>[\\s\\S]*?)\\]\\s*as\\s+const`,
      "m",
    ),
  )
  if (!match?.groups?.items) return null

  return Array.from(
    match.groups.items.matchAll(/["']([^"']+)["']/g),
    ([, value]) => value,
  )
}

function read(relPath) {
  const fullPath = path.join(root, relPath)
  if (!fs.existsSync(fullPath)) {
    failures.push(`missing ${relPath}`)
    return ""
  }
  return fs.readFileSync(fullPath, "utf8")
}

for (const relPath of [
  "public/robots.txt",
  "public/sitemap.xml",
  "public/sitemap-0.xml",
]) {
  if (fs.existsSync(path.join(root, relPath))) {
    failures.push(`${relPath} should be removed so app routes control indexing output`)
  }
}

const indexing = read("lib/seo-indexing.ts")
if (indexing) {
  const publicUiRoutes = extractExportedStringArray(
    indexing,
    "PUBLIC_UI_SITEMAP_PATHS",
  )
  if (!publicUiRoutes) {
    failures.push("lib/seo-indexing.ts: unable to parse PUBLIC_UI_SITEMAP_PATHS")
  } else if (publicUiRoutes.length !== 1 || publicUiRoutes[0] !== "/") {
    failures.push(
      'lib/seo-indexing.ts: expected "/" to be the only sitemap allowlist route',
    )
  }

  const disallowRules = extractExportedStringArray(indexing, "ROBOTS_DISALLOW_RULES")
  if (!disallowRules) {
    failures.push("lib/seo-indexing.ts: unable to parse ROBOTS_DISALLOW_RULES")
  }

  for (const expectedRule of [
    "/api/",
    "/authentication/handshake",
    "/forgot-password",
    "/new-user",
    "/verify-choice",
    "/verify-identity",
  ]) {
    if (!disallowRules?.includes(expectedRule)) {
      failures.push(`lib/seo-indexing.ts: missing disallow rule ${expectedRule}`)
    }
  }
}

const sitemap = read("app/sitemap.ts")
if (sitemap) {
  if (
    !/import\s+type\s+\{\s*MetadataRoute\s*\}\s+from\s+"next"/.test(sitemap) ||
    !/import\s+\{\s*buildSitemapEntries\s*\}\s+from\s+"@\/lib\/seo-indexing"/.test(
      sitemap,
    ) ||
    !/\bbuildSitemapEntries\s*\(\s*\)/.test(sitemap)
  ) {
    failures.push(
      "app/sitemap.ts: sitemap should import and call the shared buildSitemapEntries() helper",
    )
  }
}

const robots = read("app/robots.txt/route.ts")
if (robots) {
  if (!/ROBOTS_DISALLOW_RULES/.test(robots)) {
    failures.push("app/robots.txt/route.ts: robots.txt must use shared disallow rules")
  }
  if (!/SITE_SITEMAP_URL/.test(robots)) {
    failures.push("app/robots.txt/route.ts: robots.txt must reference the canonical sitemap URL")
  }
}

const middleware = read("middleware.ts")
if (middleware) {
  if (!/shouldApplyNoindexHeader/.test(middleware)) {
    failures.push("middleware.ts: missing shared noindex header guard for non-public routes")
  }
  if (!/X-Robots-Tag/.test(middleware)) {
    failures.push("middleware.ts: non-public routes should emit X-Robots-Tag")
  }
}

if (failures.length > 0) {
  console.error(`FAIL ${path.basename(root)} (indexing controls)`)
  for (const failure of failures) {
    console.error(`  - ${failure}`)
  }
  process.exit(1)
}

console.log(`OK ${path.basename(root)} (indexing controls)`)
