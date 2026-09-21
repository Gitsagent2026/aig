import test from "node:test"
import assert from "node:assert/strict"

import { normalizeSeoWorkflowPayload, parseBoolean, toStringArray } from "./seo-workflow-request.mjs"

test("toStringArray normalizes arrays", () => {
  assert.deepEqual(toStringArray([" a ", "", 5, null]), ["a", "5"])
  assert.deepEqual(toStringArray("x"), [])
})

test("parseBoolean is strict", () => {
  assert.equal(parseBoolean(true), true)
  assert.equal(parseBoolean(false), false)
  assert.equal(parseBoolean("true"), true)
  assert.equal(parseBoolean("false"), false)
  assert.equal(parseBoolean(" yes "), false)
  assert.equal(parseBoolean(1), false)
})

test("normalizeSeoWorkflowPayload validates topic", () => {
  const bad = normalizeSeoWorkflowPayload({})
  assert.equal(bad.ok, false)
  assert.equal(bad.error, "topic is required")
})

test("normalizeSeoWorkflowPayload normalizes booleans and arrays", () => {
  const ok = normalizeSeoWorkflowPayload({
    topic: "  hsa login ",
    includeBacklinkResearch: "false",
    competitorDomains: ["A.com", "", "B.com"],
    userSeedKeywords: ["alpha", " "],
    lead: { source: "organic" },
  })
  assert.equal(ok.ok, true)
  assert.equal(ok.value.topic, "hsa login")
  assert.equal(ok.value.includeBacklinkResearch, false)
  assert.deepEqual(ok.value.competitorDomains, ["A.com", "B.com"])
  assert.deepEqual(ok.value.userSeedKeywords, ["alpha"])
  assert.equal(ok.value.lead.source, "organic")
})
