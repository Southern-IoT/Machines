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
| **Content Pipeline** | **Python (GPT-4o)** | Automated LaTeX report parsing to compliant JSON |

---

## 2. Mandatory Rules for Schema Changes

When modifying the website schema or adding new fields, follow these rules to avoid breaking the CI/CD pipeline and the TinaCMS admin interface:

### 🚨 Rule 1: Always Generate and Commit `tina-lock.json`
- **What it is**: `tina/tina-lock.json` is a lock file used by TinaCloud to map the local GraphQL schema structure with the remote cloud indexer.
- **Why it matters**: If you update `tina/config.ts` but do not update and push `tina/tina-lock.json`, the remote build inside GitHub Actions **will fail** with a GraphQL schema mismatch exit code 1.
- **Action**: Every time you modify `tina/config.ts`:
  1. Start the local dev server using `npx tinacms dev` or `npm run cms`.
  2. Wait for it to output `✅ 🦙 TinaCMS Dev Server is active`. This regenerates `tina/tina-lock.json` locally.
  3. Stop the server, stage `tina/tina-lock.json`, and commit it along with your changes. **Never delete this file permanently.**

### 🚨 Rule 2: Keep All Category Enums Synchronized
- **What it is**: The `category` field in `tina/config.ts` restricts values to a predefined list of string options.
- **Why it matters**: If you or the Python parsing agent adds a machine JSON file with a category value that is *not* in the config options list, **TinaCMS saving operations will crash** with a validation error.
- **Action**: If a machine requires a new category:
  1. First, add the category name to the `options` array inside `tina/config.ts`.
  2. Re-run `npx tinacms dev` to generate the new lock-file.
  3. Save the machine JSON file with the new category.

### 🚨 Rule 3: Keep the Python Extraction Agent Schema Aligned
- **What it is**: The standalone Python parser in `latex-to-json-agent/` relies on `latex-to-json-agent/schema_reference.json` to extract machine parameters from LaTeX.
- **Action**: When you add, rename, or modify a field in `tina/config.ts` (e.g. adding `purposeAndApplication` or `partsList.section`), you MUST immediately update `latex-to-json-agent/schema_reference.json` so the AI extraction pipeline remains accurate and forward-compatible.

---

## 3. Core Files to Know

- [tina/config.ts](file:///d:/Southern_Machines/tina/config.ts) — The primary source of truth for the database schema, including field groups, datatypes, and select dropdown options.
- [tina/tina-lock.json](file:///d:/Southern_Machines/tina/tina-lock.json) — The schema signature that MUST be updated and committed for TinaCloud synchronization.
- [src/content/machines/](file:///d:/Southern_Machines/src/content/machines) — The directory containing all machine records stored as `.json` files.
- [src/pages/machines/[slug].astro](file:///d:/Southern_Machines/src/pages/machines/%5Bslug%5D.astro) — The detail page layout which reads machine JSON properties directly.
- [latex-to-json-agent/schema_reference.json](file:///d:/Southern_Machines/latex-to-json-agent/schema_reference.json) — The schema used by the Python parser to extract machine metadata.

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
* **Cause**: The `finalNotes` field in `tina/config.ts` was configured as `type: "string"` (a single multiline text block), but the Python extraction agent was outputting `finalNotes` as an array of strings in some files.
* **Resolution**:
  1. Standardized `finalNotes` in `tina/config.ts` as a string (`type: "string", ui: { component: "textarea" }`).
  2. Rewrote the Python agent parsing prompts in `latex-to-json-agent/latex_to_json_agent.py` and changed `latex-to-json-agent/schema_reference.json` to ensure it only generates a single newline-separated bulleted string for `finalNotes`.

### Case Study 3: Schema Drift & Lock-File Missing Build Failure (May 2026)
* **Symptom**: Pushing a correct `tina/config.ts` fails during `npx tinacms build && npm run build` in GitHub Actions with:
  `The local GraphQL schema doesn't match the remote GraphQL schema... Reason: [NON_BREAKING - TYPE_ADDED]`
* **Cause**: The local lock file `tina/tina-lock.json` was deleted and was not committed to the repository, leaving TinaCloud unable to sync the remote schema with the new local types (e.g. `MachinePurposeAndApplication`).
* **Resolution**:
  1. Ran `npx tinacms dev` locally to spin up the local indexer and regenerate `tina/tina-lock.json`.
  2. Committed and pushed `tina/tina-lock.json` to the remote branch. The remote build immediately succeeded.

---
*(End of playbook. Future agents: Append your case studies here.)*
