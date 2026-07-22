---
name: research-machine
description: Research and document a factory machine from a brand + model number. Runs the full 4-round research pipeline using Tavily MCP, then produces a complete JSON file conforming to the schema in tina/config.ts.
trigger: /research
---

# /research — Full Machine Research & Documentation Pipeline

You are the **Machine Research Agent** for the Southern Machines project. The user has invoked you with a machine name and model number. Your job is to produce a complete, schema-compliant machine JSON file at `src/content/machines/[slug].json` using the **Tavily MCP** as your primary research tool.

## Activation

This skill is triggered by:
- The `/research` slash command
- Any user message matching `research <brand> <model>` (e.g. "research JUKI LK-1900BN")
- Any user message of the form "document <brand> <model>" or "add <brand> <model>"

## Step 0 — Load the rules

Before doing anything, read these files in order:

1. `.puku/research-rules.md` — Full research & documentation ruleset (MANDATORY)
2. `AI_PLAYBOOK.md` — Project conventions, schema rules, troubleshooting
3. `tina/config.ts` — Current schema (so you know what fields exist and what enums are valid)
4. `tina/tina-lock.json` — Lock file (do NOT modify; if schema changes are needed, follow AI_PLAYBOOK Rule 1)
5. `src/lib/machines.ts` — Machine loader (so you understand the data shape)
6. One existing machine JSON (e.g. `src/content/machines/juki-lk-1900bn.json`) — to see the canonical example

## Step 1 — Parse the request

Extract from the user's input:
- **Brand** (e.g. "JUKI", "Brother", "Kansai Special")
- **Model** (e.g. "LK-1900BN", "DA-927A", "MO-6816D")
- **Optional context** — the user may provide extra info (image path, drive link, machine type). If so, use it; otherwise leave fields empty (with `🔴` flag where appropriate).

Determine the **slug** by lowercasing the model and replacing non-alphanumeric chars with `-`:
- "JUKI LK-1900BN" → `juki-lk-1900bn`
- "Brother DA-927A" → `brother-da-927a`
- "Pegasus EX-ST324A" → `pegasus-ex-st324a` (legacy; not currently in directory)
- "JUKI MO-6816D" → `juki-mo-6816d`

If a file already exists at `src/content/machines/[slug].json`, ASK the user before overwriting. (They may want to verify, or run `/research-verify` instead.)

## Step 2 — Round 1 research (manufacturer confirmation)

Call the Tavily MCP tool (`tavily_search`) with:
```
{ query: "<Brand> <Model> manufacturer official site", max_results: 5 }
```

Identify the official manufacturer domain (e.g. `juki.co.jp`, `brother-usa.com`). Add it to a "verified sources" list — every later search should restrict to this domain.

**If Tavily fails or returns no official source:** Fall back to `WebSearch` with the same query. If still no result, mark the manufacturer domain `🔴 Not officially documented` and STOP — do not proceed with unofficial sources.

## Step 3 — Round 2 research (technical manual)

Call `tavily_search` with:
```
{
  query: "<Brand> <Model> service manual OR technical manual filetype:pdf",
  include_domains: ["<manufacturer domain>"],
  max_results: 10
}
```

For each PDF URL returned, call `tavily_extract` to get the full text. Read the manual carefully and extract:
- All technical specs (Section 1.6)
- All working principles (Section 1.7) — note which component IDs are mentioned
- All maintenance entries (Section 1.10) — note the source page
- The lubrication schedule, safety warnings, model-specific notes (Section 1.12)

If no PDF is found, mark all manual-derived sections `🔴` and continue with what you have.

## Step 4 — Round 3 research (parts catalog)

Call `tavily_search` with:
```
{
  query: "<Brand> <Model> parts catalog PDF OR parts list PDF OR spare parts PDF",
  include_domains: ["<manufacturer domain>"],
  max_results: 10
}
```

You want to surface **direct PDF links** in the search results, not portal pages. Common JUKI patterns to probe if Tavily returns only the login-gated portal:
- `https://www.juki.co.jp/industrial_j/download_j/manual_j/<model>/menu/pdf/partslist_<lang>.pdf`
- `https://www.juki.co.jp/industrial_e/download_e/manual_e/<model>/menu/pdf/partslist_<lang>.pdf`
- `https://www.juki.co.jp/industrial_j/admin/pdata/filedata/<n>/<model><lang>.pdf`
- `https://www.juki.co.jp/industrial_j/download_j/manual_j/<model>.pdf`

If the manufacturer has no public parts PDF, check authorized distributors (e.g. rigo.si, sewtech.com) for the same model.

For each parts catalog PDF returned, call `tavily_extract` and **read every page**. The catalog is the source of truth for parts — extract:

For EACH part:
- `partName` (official name)
- `partId` (Component ID, EXACTLY as printed)
- `qty` (per-machine quantity, e.g. "1", "2", "4", "as needed")
- `material` (if listed)
- `function` (from the catalog description or the manual)
- `category` (assign to one of the standard categories below based on catalog section)

**Standard parts categories** (assign each part to exactly one):
- `Drive & Transmission`
- `Cutting Assembly` (or `Primary Operation Assembly` for non-cutting machines)
- `Sharpening System` (skip if not applicable)
- `Lubrication System` (skip if not applicable)
- `Motor & Electrical`
- `Frame & Housing`
- `Base & Rollers`
- `Fasteners & Hardware` (every bolt, screw, washer, pin, nut, key — INDIVIDUAL rows)
- `Covers & Guards`
- `Consumables` (blades, belts, oils, greases)
- `Control & Switches`
- `Pneumatic / Hydraulic` (if present)
- `Other`

**ABSOLUTE RULE: Every single part in the catalog gets a row. No summarizing, no grouping, no skipping "minor" parts.** Fasteners, washers, springs, pins, covers, screws, nuts, grommets, gaskets — all individually. Variants (Left/Right, different sizes, different grits) are SEPARATE rows.

If a part has no Component ID in the catalog, set `partId: ""` (empty string), NOT `"—"`.

## Step 3.5 — Resource source preference (direct PDFs over login portals)

When collecting sources for the `resources[]` array (and for the per-part `source` field), follow this strict preference order:

1. **🥇 Direct PDF download** — single-file PDFs hosted on the manufacturer's site, accessible without login, that resolve to a real `.pdf` file when fetched (HTTP 200, content-type `application/pdf`, size > 10 KB). Examples:
   - `https://www.juki.co.jp/industrial_j/download_j/manual_j/mo6800_dd10/menu/pdf/partslist_d.pdf` (parts list, 3 MB)
   - `https://www.juki.co.jp/industrial_j/download_j/manual_j/mo6800_dd10/menu/pdf/instruction_eg.pdf` (instruction manual, 6 MB)
   - `https://www.rigo.si/spare%20parts/Juki/LBH-1790A.pdf` (authorized-distributor parts list)
   - **This is the required form for the parts list source.** Verify with `curl -sI` (HTTP 200, content-type includes `pdf`, content-length > 10000) before adding.

2. **🥈 Static HTML product page** — manufacturer domain, no login required, contains the verified specs. Used for the product overview resource and as the per-part `source` when no direct PDF URL is available for that specific part.

3. **🥉 Authorized distributor page** — sites like rigo.si, sewtech.com, machinesales.com that explicitly publish Juki parts PDFs without login. Use the direct PDF URL on the distributor, not the distributor's category/portal page.

4. **❌ NEVER include a login-gated portal URL** as a source. Specifically:
   - `https://www.juki.co.jp/partslist/?language=en` (WebPartsList — login required)
   - `https://www.juki.co.jp/partslist/download/` (login required)
   - Any URL that returns a login form, a 200 with `<form name="qform">`, or a 500 from `curl -sL`

   If the only thing the manufacturer publishes is a login portal, the agent MUST keep searching — probe the product page for `href` patterns like `*.pdf`, `partslist_*`, `pl_*`, `*_parts.pdf`, `manual_*`, `instruction_*`, `*_dd10/menu/pdf/*`. Common JUKI patterns: `.../download_j/manual_j/<model>/menu/pdf/<doctype>[_eg].pdf`.

5. **For each resource entry, the `url` field MUST point to a real, live, single-click destination** (PDF or static page). No portals, no login walls, no JavaScript-only modals.

**Verification protocol** before adding any URL to the JSON:
```
curl -sI "<url>"                              # check status
curl -sI "<url>" | grep -i "content-type"     # confirm PDF vs HTML
curl -sI "<url>" | grep -i "content-length"   # confirm size > 10 KB
```
If status is not 200, or content-type is `text/html` for what should be a PDF, or size < 10 KB, **do NOT add the URL** — keep searching.

## Step 5 — Round 4 verification

Cross-check everything:
1. Specs in the manual vs. specs in the catalog — flag any conflict with `❌`
2. Part IDs that appear in both the manual and the catalog — confirm they match
3. Total part count should match the catalog index
4. Apply flags:
   - `✅` if 2+ official sources agree
   - `⚠️` if only 1 official source
   - `❌` if sources conflict (note both values + URLs)
   - `📋` if from manual only, not yet cross-checked
   - `🔴` if no official source

### 🚨 Anti-pattern: invented URLs

**NEVER put a URL in the `source` field of a part (or anywhere in the JSON) unless that exact URL was returned by a live tool call in this session** — `tavily_search`, `tavily_extract`, `WebSearch`, `WebFetch`, or `curl`.

If you don't have live research tools available and can't verify a URL, do one of these instead:
- Use `🔴` (unverified) with `source: ""`
- Use `📋` (manual only) with `source: ""` if the part is from training-time knowledge
- Use `⚠️` with the **one** URL that you actually fetched and confirmed in this session

This is non-negotiable. A 404 link in a public database is worse than a missing link. See `AI_PLAYBOOK.md` Case Study 6 for the real example.

## Step 6 — Schema compatibility check

Read `tina/config.ts` and verify:
- The machine's `category` is in the enum `options` array. If not, add it FIRST.
- All fields you'll write exist in the schema. If you need a new field, follow AI_PLAYBOOK Rule 1 (regenerate `tina-lock.json` via `npx tinacms dev`).

If a new brand is being introduced, add it to:
- `brandTranslations` object in `src/layouts/BaseLayout.astro`
- `brands` array in the same file (for translation wrapping)

## Step 7 — Build the JSON file

Create `src/content/machines/[slug].json` with ALL 12 sections populated per `.puku/research-rules.md` Section 1. Mandatory structure:

```json
{
  "title": "...",
  "subtitle": "...",
  "brand": "...",
  "category": "...",
  "machineImage": "/uploads/... (or empty string if no official image)",
  "reportDownloadUrl": "... (or empty if not officially documented)",
  "publishedDate": "<today's ISO date>",
  "purposeAndApplication": {
    "purpose": "...",
    "applications": ["...", "..."],
    "industry": "..."
  },
  "overviewDescription": "...",
  "classificationTable": [
    { "field": "Machine Name", "value": "..." },
    { "field": "Brand / Manufacturer", "value": "..." },
    { "field": "Country of Manufacture", "value": "..." },
    { "field": "Model Series", "value": "..." },
    ...
  ],
  "technicalSpecs": [
    { "parameter": "...", "value": "..." }
  ],
  "workingPrinciples": [
    {
      "heading": "1. Mechanical Drive",
      "description": "...",
      "componentIds": ["M-027", "M-004"]
    },
    ...
  ],
  "sequenceFlow": [
    { "stepTitle": "Pre-start Check 1: ...", "stepDescription": "..." },
    ...
    { "stepTitle": "Shutdown & Storage", "stepDescription": "..." }
  ],
  "partsList": [
    {
      "partName": "...",
      "partId": "M-027",
      "category": "Drive & Transmission",
      "qty": "1",
      "material": "High Speed Steel",
      "function": "...",
      "verified": "✅",
      "source": "https://www.juki.co.jp/partslist/lk1900bn.pdf"
    },
    ...
  ],
  "maintenance": [
    {
      "code": "...",
      "definition": "...",
      "action": "...",
      "flag": "⚠️ Field Reported"  // optional, only if not in official manual
    }
  ],
  "resources": [
    { "resourceName": "Official Parts Catalog PDF", "description": "Direct PDF download with exploded diagrams and part numbers", "url": "https://www.<manufacturer>/path/partslist_<model>.pdf" },
    { "resourceName": "Technical / Service Manual PDF", "description": "Direct PDF download with working principles, lubrication, maintenance", "url": "https://www.<manufacturer>/path/instruction_<model>.pdf" },
    { "resourceName": "Official Product Page", "description": "Manufacturer product page with full specifications", "url": "https://www.<manufacturer>/path/<model>.html" }
  ],
  "finalNotes": "• ...\n• ...\n• ...",
  "partsMeta": {
    "totalParts": 0,             // count of partsList entries
    "catalogSource": "https://...",
    "catalogVersion": "... (or empty if unknown)",
    "lastVerified": "<today's ISO date>"
  }
}
```

**If schema doesn't yet support these new fields** (partsMeta, qty, material, verified, source, category on parts, componentIds on workingPrinciples, flag on maintenance), STOP and add them to `tina/config.ts` and `tina-lock.json` first per AI_PLAYBOOK Rule 1.

## Step 8 — Build and verify

Run:
```bash
cd "D:\Southern_Machines" && npm run build
```

If build fails, debug and fix. Common issues:
- New `category` enum value missing from `tina/config.ts` (fix: add it + regenerate lock)
- Field type mismatch (fix: align JSON to schema)
- Malformed JSON (fix: validate with `node -e "JSON.parse(require('fs').readFileSync('path'))"`)

## Step 9 — Report back

Summarize for the user:
- **Brand / Model:** ...
- **Manufacturer domain verified:** ... (or `🔴 unverified`)
- **Sources used:** list of URLs
- **Total parts documented:** N (across K categories)
- **Coverage:**
  - `purposeAndApplication`: ✅/⚠️/🔴
  - `technicalSpecs`: ✅/⚠️/🔴
  - `workingPrinciples`: N sections (min 4)
  - `sequenceFlow`: N steps (pre-start to shutdown)
  - `partsList`: N parts (target: 30+)
  - `maintenance`: N entries (min 6)
  - `resources`: N (target: at least Technical Manual + Parts Catalog + Official Website)
- **Gaps / flags:** any `⚠️`, `❌`, `🔴` fields, with reasons
- **Schema changes made:** list of any `tina/config.ts` additions
- **Build result:** ✅ / ❌ (with error details if failed)

## Step 10 — Stop and wait

Do not commit, push, or modify any other files. Wait for the user to review the output, run `git status`, and decide what to do next.

## Anti-Patterns (Forbidden)

- ❌ Inventing part numbers — use only what the official catalog lists
- ❌ Summarizing parts ("and similar fasteners") — every part is its own row
- ❌ Using unofficial sources (forums, YouTube, Amazon) for specs or part numbers
- ❌ Skipping sections — every machine needs all 12
- ❌ Estimating quantities — if catalog says "1", write "1"; if "as needed", write "as needed"
- ❌ Filling `🔴` fields with plausible guesses
- ❌ Auto-committing or auto-pushing — the user reviews first
- ❌ Modifying existing machines without explicit user request

---

## Example Invocation

User: `/research JUKI MO-6816D`

The skill reads the rules, calls Tavily in 4 rounds, produces `src/content/machines/juki-mo-6816d.json` (or notes that the file already exists and asks to overwrite), runs `npm run build`, and reports back with the summary.

---

*(End of skill. Updated 2026-06-16.)*
