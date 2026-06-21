# Southern Machines — AI & Developer Playbook

This playbook serves as a critical onboarding document, development standard, and troubleshooting log for any AI agent or developer working on the **Southern Machines** codebase. 

> [!IMPORTANT]
> **READ BEFORE COMMITTING CHANGES**: Any AI agent working on this repository MUST read this file in full, adhere to these standards, and update the "Troubleshooting & Resolution Log" at the bottom of the document after solving any new build, content, or CMS issues.

---

## 1. System Architecture & Tech Stack

The Southern Machines directory is structured as a Git-backed headless CMS static database:

| Component | Technology | Role |
|---|---|---|
| **Static Site Generator** | **Astro 6.x** | Compiles content to static HTML |
| **Styling** | **Tailwind CSS 4.x** | Modern styling via Vite plugin integration |
| **Headless CMS** | **TinaCMS 3.x** | Visual Git-backed CMS dashboard at `/admin` |
| **Indexing Service** | **TinaCloud** | Cloud-based GraphQL indexer and authentication |
| **CI/CD** | **GitHub Actions** | Rebuilds and deploys the site on push to `main` |


---

## 2. Mandatory Rules for Schema Changes

When modifying the website schema or adding new fields, follow these rules to avoid breaking the CI/CD pipeline and the TinaCMS admin interface:

### 🚨 Rule 1: Always Generate and Commit `tina-lock.json`
- **What it is**: `tina/tina-lock.json` is a lock file used by TinaCloud to map the local GraphQL schema structure with the remote cloud indexer.
- **Why it matters**: If you update `tina/config.ts` but do not update and push `tina/tina-lock.json`, the remote build inside GitHub Actions **will fail** with a GraphQL schema mismatch exit code 1. The error log will show a line like `[NON_BREAKING - TYPE_ADDED] Type 'X' was added` immediately before the failure.
- **Action**: Every time you modify `tina/config.ts`:
  1. Regenerate the lock file with `npx tinacms dev --no-server` (no token required — runs the codegen, writes `tina/tina-lock.json`, exits). This is the safe local-only path.
  2. Stage `tina/tina-lock.json` and commit it in the same commit (or right after) the `tina/config.ts` change.
  3. **Never delete this file permanently.**
- **Recovery**: If CI fails with the schema-drift error, run `npx tinacms dev --no-server`, commit the regenerated lock, push. No need to revert the schema change.

### 🚨 Rule 1b: CI Build Uses `--skip-cloud-checks`
- **What it is**: The deploy workflow runs `npx tinacms build --skip-cloud-checks && npm run build`. The flag tells TinaCMS to use the local schema as-is without comparing to the cloud's last-indexed schema.
- **Why it matters**: Even with a freshly-regenerated `tina-lock.json`, the cloud's `Last indexed at` timestamp lags the local lock. The next `tinacms build` reports the local-vs-cloud drift as `[NON_BREAKING - TYPE_ADDED] ...` and exits 1. This blocks every deploy after a schema change.
- **Action**: Keep `--skip-cloud-checks` in `.github/workflows/deploy.yml`. Without this flag, every new collection / field added to `tina/config.ts` requires a separate manual reindex on TinaCloud before CI passes.
- **Trade-off**: We lose the cloud-side schema validation. The trade is acceptable here because (a) the lock file is committed and reviewed in PRs, (b) the site itself doesn't need a live cloud connection at build time, and (c) the alternative is a brittle deploy that breaks on every non-breaking change.

### 🚨 Rule 2: Keep All Category Enums Synchronized
- **What it is**: The `category` field in `tina/config.ts` restricts values to a predefined list of string options.
- **Why it matters**: If you or the Python parsing agent adds a machine JSON file with a category value that is *not* in the config options list, **TinaCMS saving operations will crash** with a validation error.
- **Action**: If a machine requires a new category:
  1. First, add the category name to the `options` array inside `tina/config.ts`.
  2. Re-run `npx tinacms dev` to generate the new lock-file.
  3. Save the machine JSON file with the new category.

### 🚨 Rule 3: Commit After Every Update

* **What it means**: After ANY change to the repository — code, content, schema, images, lock files, case studies in this playbook — the agent MUST commit the change with a clear, descriptive message before stopping.
* **Why it matters**:
  1. The site is a Git-backed headless CMS. Uncommitted changes are invisible to the production deploy, TinaCMS, RSS, and sitemap.
  2. The user's standing instruction (June 2026) is: *"after every update please commit..make it a rule"*. This is non-negotiable.
  3. TinaCMS reads from `main` branch — uncommitted schema changes break the local-dev `tinacms dev` workflow.
  4. Case studies and rule updates in this playbook only become permanent once committed.
* **Action — every time, no exceptions**:
  1. After the work is done and verified (`npm run build` succeeds, files look right), run:
     ```bash
     git status
     git diff --stat
     git add <specific files>          # prefer specific paths over `git add -A`
     git commit -m "<type>: <imperative summary>

     Co-Authored-By: Sonnet 4.6 <noreply@puku.sh>"
     ```
  2. Use a clear commit-message prefix that matches the project convention:
     - `feat:` — new feature (new machine, new collection, new component)
     - `fix:` — bug fix
     - `refactor:` — code reorganisation with no behaviour change
     - `docs:` — playbook / rules / comments / README updates
     - `chore:` — tooling, build, lock files, .gitignore
     - `style:` — CSS / formatting only
  3. **DO NOT push to remote** unless the user explicitly asks. The user reviews locally and pushes manually.
  4. **DO NOT amend** existing commits — create a new commit instead.
  5. **DO NOT use `git add -A` / `git add .`** when there might be untracked junk (e.g. temporary files in the project root). Stage only the files you intentionally changed.
* **Anti-patterns**:
  - ❌ Doing the work, declaring "done", and waiting for the user to commit manually.
  - ❌ Grouping unrelated changes in one commit (e.g. schema + bobbin image + case study in one giant commit).
  - ❌ Vague messages like "update" or "changes".
* **When this rule does NOT apply**:
  - Plan mode (no edits = nothing to commit).
  - Pure read-only research / exploration with no file changes.
  - The user explicitly says "don't commit" for that specific change.

---

## 3. Core Files to Know

- [tina/config.ts](file:///d:/Southern_Machines/tina/config.ts) — The primary source of truth for the database schema, including field groups, datatypes, and select dropdown options.
- [tina/tina-lock.json](file:///d:/Southern_Machines/tina/tina-lock.json) — The schema signature that MUST be updated and committed for TinaCloud synchronization.
- [src/content/machines/](file:///d:/Southern_Machines/src/content/machines) — The directory containing all machine records stored as `.json` files.
- [src/pages/machines/[slug].astro](file:///d:/Southern_Machines/src/pages/machines/%5Bslug%5D.astro) — The detail page layout which reads machine JSON properties directly.

---

## 4. Troubleshooting & Resolution Log

Refer to this log if similar errors emerge in the future. Add new entries at the bottom as new issues are resolved.

### Case Study 1: The Category Mismatch Save Error (May 2026)
* **Symptom**: TinaCMS dashboard throws generic/blank error messages or fails to save mutations after adding new machine records (e.g. the Brother & Bedoly machines).
* **Cause**: The Brother machine used `category: "Chain Stitch Machine"` and Bedoly used `category: "Cylinder Bed Sewing Machine"`, but neither was listed in the `options` array of the `category` field in `tina/config.ts`.
* **Resolution**:
  1. Added both options to `options: [...]` in `tina/config.ts`.
  2. Regenerated the schema.

### Case Study 2: The Array vs. String `finalNotes` Mismatch (May 2026)
* **Symptom**: CI/CD pipeline builds successfully but detail page crashed on render or threw compilation errors.
* **Cause**: The `finalNotes` field in `tina/config.ts` was configured as `type: "string"` (a single multiline text block), but some machine JSON files contained `finalNotes` as an array of strings.
* **Resolution**:
  1. Standardized `finalNotes` in `tina/config.ts` as a string (`type: "string", ui: { component: "textarea" }`).
  2. Audited and rewrote all machine JSON files in `src/content/machines/` so `finalNotes` is a single newline-separated bulleted string.

### Case Study 3: Schema Drift & Lock-File Missing Build Failure (May 2026)
* **Symptom**: Pushing a correct `tina/config.ts` fails during `npx tinacms build && npm run build` in GitHub Actions with:
  `The local GraphQL schema doesn't match the remote GraphQL schema... Reason: [NON_BREAKING - TYPE_ADDED]`
* **Cause**: The local lock file `tina/tina-lock.json` was deleted and was not committed to the repository, leaving TinaCloud unable to sync the remote schema with the new local types (e.g. `MachinePurposeAndApplication`).
* **Resolution**:
  1. Ran `npx tinacms dev` locally to spin up the local indexer and regenerate `tina/tina-lock.json`.
  2. Committed and pushed `tina/tina-lock.json` to the remote branch. The remote build immediately succeeded.

### Case Study 4: Hidden Extra Field on Existing Machine (June 2026)
* **Symptom**: `brother-da-927a.json` contained a `gaugePartsCrossReference` array of 6 entries that no other machine had, and that was not declared in the TinaCMS schema.
* **Cause**: The field was added to the JSON file directly without being added to `tina/config.ts`. Because TinaCMS does not know about the field, the next time the machine is saved through the admin panel, those 6 entries are silently dropped.
* **Resolution**:
  1. Added `gaugePartsCrossReference` to `tina/config.ts` as a typed object list with six string fields (`gaugeCode`, `description`, `needles`, `needleGauge`, `presserFoot`, `feedDog`).
  2. Updated `tina/tina-lock.json` with the same field definition and namespace so the local GraphQL schema matches the new type.
  3. Rendered the new field in `[slug].astro` (SectionCard with id `gauge-parts`, conditionally shown only when the array is non-empty).
  4. Verified: `npm run build` succeeded, the field rendered correctly for brother-da-927a, and the field is hidden on all other machines.

### Case Study 5: New Brand Requires Translation Map Update (June 2026)
* **Symptom**: When a new brand was introduced (e.g. "KM", "Kansai Special"), the language toggle showed the brand name in English in both English and Bengali modes instead of being translated.
* **Cause**: The brand translation map and the brand-notranslate list in `src/layouts/BaseLayout.astro` were not updated when a new brand was added to the directory.
* **Resolution**:
  1. Added the new brand to the `brandTranslations` object (English → Bengali).
  2. Added the new brand to the `brands` array used by the `prepareDOMForTranslation` function so it gets wrapped in `<span class="brand-text notranslate">` for selective translation.
  3. Verified: Reloading the page in Bengali mode now shows the Bengali brand name.

### Case Study 6: Fabricated Source URLs in JUKI MO-6816D (June 2026)
* **Symptom**: User reported "Not Found" when clicking source URLs from the JUKI MO-6816D parts list. HTTP probing confirmed two URLs returned 404:
  - `https://www.juki.co.jp/industrial_e/products_e/mo6800s.html`
  - `https://www.juki.co.jp/industrial_e/download_e/manual_e/mo6800d/instruction_eg.pdf`
* **Cause**: The research agent was spawned in an environment where Tavily MCP, WebSearch, and WebFetch were all unavailable. It then used its training-time knowledge of the JUKI MO-6800D series to produce plausible-looking official URLs — but those URLs do not actually exist on juki.co.jp. The agent had honestly disclosed the missing-tool problem in its report, but did not connect that disclosure to the URL field of the JSON. The result was a file full of 404 links presented as official sources.
* **Why this matters**: A public database that links to dead pages is worse than one with no links. Users trust the website's "official source" labels; broken links destroy that trust instantly.
* **Resolution**:
  1. Verified all URLs in the file with `curl` / `WebFetch`. Removed 2 fabricated ones.
  2. Searched for the real JUKI MO-6800D product page via `WebFetch` against the juki.co.jp model list. Found the real URL: `https://www.juki.co.jp/industrial_j/products_j/apparel_j/overlock/detail.php?cd=MO-6800D` (200 OK).
  3. Pulled verified specs directly from the official JUKI product page: 7,000 sti/min, 24.5 mm needle bar stroke, 20° needle angle, DC×27 needle system, 7 mm presser foot lift, 63.7 N pressure, differential 1:2/1:0.7, 27 kg head weight, JUKI MACHINE OIL 18.
  4. Replaced all `📋` flags with `⚠️` (1 official source), which honestly reflects that we have one real source but need a second to upgrade to `✅`.
  5. Updated `.puku/skills/research-machine.md` with an explicit "Anti-pattern: invented URLs" rule.
* **Lesson (codified)**: When live research tools are unavailable, the agent must NOT invent plausible URLs. Use `🔴` (unverified) with empty `source`, or `📋` (manual only) with empty `source`. Only use a URL that was directly returned by a live tool call in the same session. This rule is now part of the skill itself.

### Case Study 7: Login Portals Are Not Sources — Use Direct PDFs (June 2026)
* **Symptom**: After fixing the JUKI MO-6816D file (Case Study 6), the `resources[]` array still contained `https://www.juki.co.jp/partslist/?language=en` — the JUKI WebPartsList portal. The portal returns HTTP 200 but only serves a login form, not a parts list. Users clicking the link in the rendered page get a useless login wall.
* **Cause**: The first fix (Case Study 6) focused on whether URLs were reachable, not on whether they were **single-click useful** for the end user. A URL that requires login is functionally a 404 for our purposes — the user cannot get the parts data from it.
* **Why this matters**: The whole point of the `resources[]` array is to give users a direct path to the source material. Login portals defeat that purpose. The user already has the password in this case (they work in the factory), but anonymous public users do not.
* **Resolution**:
  1. User supplied the correct direct-PDF URL: `https://www.juki.co.jp/industrial_j/download_j/manual_j/mo6800_dd10/menu/pdf/partslist_d.pdf` — verified 200 OK, 3 MB, content-type `application/pdf`. No login required.
  2. Also discovered a sibling URL in the same folder: `instruction_eg.pdf` — the English instruction manual, 6 MB, 200 OK.
  3. Added the parts list PDF as resource #3 in the file.
* **Lesson (codified as "Resource source preference" rule in `.puku/skills/research-machine.md` Step 3.5)**:
  1. **Direct PDF > static HTML page > authorized distributor > ❌ login portal.** Never include a login-gated URL.
  2. The `resources[].url` field MUST point to a real, live, single-click destination.
  3. Before adding any URL, verify with `curl -sI`: status 200, content-type is `application/pdf` (for PDFs), content-length > 10 KB.
  4. Common JUKI direct-PDF URL patterns to probe when the portal is the only thing the search returns:
     - `.../download_j/manual_j/<model>/menu/pdf/partslist_<lang>.pdf`
     - `.../admin/pdata/filedata/<n>/<model><lang>.pdf`
     - `.../download_j/manual_j/<model>.pdf`
  5. If the manufacturer has no public PDF, check authorized distributors (e.g. `rigo.si/spare%20parts/Juki/...`).
* **This rule now lives in the skill itself**, so future `/research` invocations will prefer direct PDFs automatically.

### Case Study 8: Always Commit After Every Update (June 2026)
* **User instruction**: *"after every update please commit..make it a rule"*
* **Symptom**: Throughout the JUKI MO-6816D and parts-library work, the agent declared work "done" after editing files but left them uncommitted. The user had to manually run `git add` + `git commit` each time. This adds friction and means the work isn't actually persisted to the repository's history until the user takes action.
* **Why it matters**:
  1. The site is a Git-backed static site. The `main` branch IS the production. Uncommitted work is invisible to the deploy.
  2. TinaCMS reads from `main`. If a new collection (e.g. `partsLibrary`) is added to `tina/config.ts` but not committed, the next `tinacms dev` run will fail to find it locally.
  3. TinaCloud uses `tina/tina-lock.json` to sync the local and remote GraphQL schemas. Uncommitted lock-file changes break the cloud indexer.
  4. The user reviews work via `git log` / `git status`. A clean tree after each task is the expected end state, not the user's job to create.
* **Resolution**:
  1. Added a new **Rule 3** at the top of this playbook: *"Commit After Every Update"*.
  2. Defined the exact workflow: `git status` → `git diff --stat` → `git add <specific files>` → `git commit -m "type: summary"` (with `Co-Authored-By: Sonnet 4.6 <noreply@puku.sh>`).
  3. Defined commit-message prefix conventions (`feat:` / `fix:` / `refactor:` / `docs:` / `chore:` / `style:`).
  4. Codified the anti-patterns: vague messages, mixed-purpose commits, auto-pushing, amending, `git add -A`.
  5. Listed the narrow exceptions: plan mode, pure-readonly research, explicit "don't commit" from the user.
* **Lesson (codified)**: Committing is part of "done". A task is not finished until `git log` shows a new entry. This rule supersedes the older implicit convention of "let the user review the files and commit themselves".

---

## 5. The Research Automation Pipeline

As of June 2026, this project includes a fully automated research pipeline. The user can run **`/research <Brand> <Model>`** and an agent will produce a complete, schema-compliant machine JSON file from a single name + model number.

### 5.1 Pipeline Components

| File | Role |
|---|---|
| `.puku/research-rules.md` | Auto-loaded rule file (12-section documentation standard, source-priority rules, flagging system, quality gates) |
| `.puku/skills/research-machine.md` | The `/research` slash command skill — 10-step pipeline from `parse` → `build` → `report` |
| `.puku/config.json` | Registers the rules file, skills directory, and the Tavily MCP server |
| `tina/config.ts` | Schema extended with: `partsList.{category, qty, material, verified, source}`, `workingPrinciples.componentIds`, `maintenance.flag`, top-level `partsMeta`, and new category enum values |
| `tina/tina-lock.json` | Lock file kept in sync (must be regenerated after every schema change) |
| `src/components/PartsTable.astro` | Renders parts grouped by catalog category, with columns for Qty / Material / Verified / Source URL, plus a `partsMeta` footer |
| `src/components/MaintenanceTable.astro` | Renders the `flag` column for "⚠️ Field Reported" issues |
| `src/pages/machines/[slug].astro` | Renders `componentIds` chips inside working-principle cards |

### 5.2 How to Run the Pipeline

1. **User invokes** `/research JUKI LK-1900BN` (or any other `<Brand> <Model>`).
2. The agent loads `.puku/research-rules.md` automatically and reads `.puku/skills/research-machine.md` for the full 10-step recipe.
3. The agent runs 4 rounds of research:
   - **Round 1**: Identifies the official manufacturer domain (Tavily `tavily_search`).
   - **Round 2**: Finds the technical manual PDF on the manufacturer domain.
   - **Round 3**: Finds the parts catalog PDF on the manufacturer domain and reads every page.
   - **Round 4**: Cross-checks specs vs. catalog, applies flags (`✅` / `⚠️` / `❌` / `📋` / `🔴`).
4. The agent produces `src/content/machines/[slug].json` with all 12 sections populated, **at least 30 parts** (every fastener, screw, washer, pin, spring as its own row), and the `partsMeta` footer.
5. The agent runs `npm run build` to verify the schema and the page render.
6. The agent reports back with: manufacturer domain, sources used, total parts documented, coverage per section, gaps/flags, and any schema changes.

### 5.3 Research Tools Priority

Per `.puku/research-rules.md` Section 0:

1. **Primary**: Tavily MCP (`tavily_search`, `tavily_extract`) — always use first.
2. **Fallback**: Built-in `WebSearch` and `WebFetch` — only if Tavily returns no official source.
3. **Source priority** (strict, applies to both tools):
   1. Official manufacturer website
   2. Official service manual / technical manual PDF
   3. Official parts catalog PDF
   4. Authorized distributor documentation
   5. ❌ **NEVER** use forums, blogs, YouTube, Amazon, Alibaba, eBay, social media

### 5.4 Quality Gates (Hard Requirements)

A machine JSON is "complete" only when ALL are true:
- [ ] All 12 sections present and populated
- [ ] `partsList` has at least 30 entries (or all catalog parts if fewer)
- [ ] Every part has `partName`, `partId`, `category`, `qty`, `material`, `function`, `verified`, `source` populated (empty string for unknown, never `null` / `undefined`)
- [ ] Parts organized into at least 3 distinct categories
- [ ] `workingPrinciples` has at least 4 numbered sections
- [ ] `sequenceFlow` covers pre-start through shutdown
- [ ] `maintenance` has at least 6 entries
- [ ] `resources` includes: Technical Manual, Parts Catalog, Official Website
- [ ] `partsMeta.lastVerified` is a real ISO date (not `"DRAFT — incomplete"`)
- [ ] `npm run build` succeeds

If any gate fails, the machine is "draft" and `partsMeta.lastVerified` must be set to `"DRAFT — incomplete"`.

### 5.5 Existing Data — Grandfather Clause

The 13 machine files in `src/content/machines/` that existed before June 2026 were NOT researched to this standard. They are grandfathered in for historical reasons. Going forward:

- All **NEW** machines MUST follow these rules in full.
- Existing machines may be retrofitted on a best-effort basis.
- Any retrofit must add a `partsMeta` block with `lastVerified` showing the new research date.

### 5.6 Schema Fields Added in June 2026

When migrating an existing machine, the following fields can be added (all are backward-compatible — existing data without them will simply render as "—" in the new columns):

**`partsList` (per part)**
- `category` (string) — catalog group: "Drive & Transmission", "Cutting Assembly", "Sharpening System", "Lubrication System", "Motor & Electrical", "Frame & Housing", "Base & Rollers", "Fasteners & Hardware", "Covers & Guards", "Consumables", "Control & Switches", "Pneumatic / Hydraulic", "Other"
- `qty` (string) — per-machine quantity as printed in the catalog ("1", "2", "4", "as needed")
- `material` (string) — as listed in catalog
- `verified` (string, options: ✅ / ⚠️ / ❌ / 📋 / 🔴)
- `source` (string URL)

**`workingPrinciples` (per principle)**
- `componentIds` (string list) — part IDs from `partsList` that are involved in this principle

**`maintenance` (per entry)**
- `flag` (string, optional) — leave blank for entries in the official manual; use `"⚠️ Field Reported"` for known field issues not in the manual

**`partsMeta` (top-level object)**
- `totalParts` (number)
- `catalogSource` (string URL)
- `catalogVersion` (string)
- `lastVerified` (datetime)

---

## Case Study 9 — Semantic Parts Inventory (June 2026)

**Problem.** The parts image library (`src/content/parts-library/`) started naive — counting unique parts as `${brand}:${partId}` produced 503 unique entries. But many machines share the same physical parts (Bobbin, Needle DC×27, V-Belt) under different brand names and part IDs. Adding 503 images is unmanageable.

**Solution.** A 52-concept taxonomy (`src/lib/concepts.ts`) maps each part row to one canonical concept via regex patterns against `partName` + `partId`, with two-tier scoping:
- **Generic concepts** (`generic: true`): one image serves every brand (Needle DC×27, 608ZZ Bearing).
- **Brand-scoped concepts** (`generic: false`): per-brand image (Bobbin — different part numbers).

`appliesToCategories` filters prevent false matches (e.g. Upper Looper only matches Overlock/Chain Stitch machines, not lockstitch).

**Pipeline.**
1. `npm run scan-parts` walks `src/content/machines/*.json`, matches each row to a concept, writes `src/content/parts-inventory/<key>.json` per unique concept.
2. `/parts-inventory` admin page (Astro) shows 73 rows with search + status + type filters; "Add image" deep-links to TinaCMS with key/brand/partName pre-filled.
3. After upload + `npm run scan-parts`, `hasImage: true` hides the row from default view.

**Numbers.**
- 505 part rows → 73 inventory entries (86% reduction).
- 27 generic concepts (one image → many machines) + 46 brand-scoped.
- 235/505 rows matched to concepts; 270 stay as machine-specific orphans (Brother DA-927A's 173 sub-parts being the largest).

**Key learnings.**
- `generic` flag belongs in the concept definition, not at the library-entry level — it expresses semantic intent.
- `scripts/scan-parts.mjs` parses `concepts.ts` source text directly (vanilla .mjs can't import .ts) — robust depth-tracking parser handles nested braces/strings correctly.
- Brand names with spaces ("Dark Horse", "Kansai Special", "Ngai Shing") must be slugified in lookup keys — `${brand.toLowerCase()}-${concept.key}` produced filenames like `dark horse-rotary-hook.json` which break GitHub Pages.
- Don't use `Set.prototype.length` — it's `.size`.
- Push to GitHub via `git push` is the only step that requires interactive auth from a non-bash sandbox — commits are local; user must run push from their own terminal.

---
*(End of playbook. Future agents: Append your case studies here.)*
