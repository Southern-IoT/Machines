---
name: resilient-doc-fetch
description: Retrieve content from external PDFs, manuals, and web pages that a plain web_fetch call fails on — including "Failed to fetch" errors, PERMISSIONS_ERROR (URL not yet searched), ROBOTS_DISALLOWED (site blocks fetchers), Cloudflare/JS-challenge pages, and email-gated download pages. Use this whenever a direct fetch fails, whenever the user pastes a link and says it wouldn't load, or proactively whenever you're about to fetch a PDF/manual/spec-sheet from a dealer, parts-book, or manufacturer-mirror site — these fail often enough that it's worth following the ladder below instead of just retrying blindly or giving up after one error.
---

# Resilient document fetch

A single failed `web_fetch` call is rarely the end of the story — it's almost always one of a
small number of specific, diagnosable causes, each with a different correct next move. Trying the
same URL again, or giving up immediately, are both wrong most of the time. Work through the ladder
below in order; stop as soon as you have usable content, and be honest in your final report about
which rung you actually got the content from (a full-text primary fetch is not the same confidence
level as a search-snippet fragment, and the user should know which one they're getting).

## Step 0 — Read the actual error before doing anything else

The error type tells you which rung to jump to. Don't treat every failure the same way.

| Error / symptom | What it means | Where to go |
|---|---|---|
| `PERMISSIONS_ERROR: ... not in any prior search or fetch result` | The URL hasn't appeared in a `web_search` or `web_fetch` result yet in this conversation — a bare pasted URL doesn't count on its own | Step 1 |
| `ROBOTS_DISALLOWED` | The site's robots.txt blocks automated fetching. This is **permanent for that domain** via `web_fetch` — retrying the same URL, or trying a different page on the same domain, will not work through that tool | Step 3 (Tavily is the connector fallback for this — see Step 3.) |
| Page loads but shows a "Client Challenge" / "enable JavaScript" / Cloudflare interstitial | Same practical effect as ROBOTS_DISALLOWED for `web_fetch` | Step 3 |
| 404 / timeout / generic fetch failure | Could be a genuinely dead link, a typo in the URL (check encoding — spaces as `%20` vs literal, trailing punctuation), or transient | Step 2, then Step 3 |
| Page loads but the actual document is gated behind an email-capture / "request a download link" form | Technically not a fetch failure, but functionally the same dead end — do not fill in or invent an email address on the user's behalf | Step 3 |

`references/known-site-behaviors.md` has a running list of domains already characterized this way
(e.g. supsew.com blocks all automated fetches; scribd.com serves a JS challenge; allsewing.net's
manual pages exist but gate the actual PDF behind an email form). Check it first — it saves
re-discovering the same dead end — but verify rather than trust blindly if it's been a while, since
sites change their robots.txt and paywalls over time.

## Step 1 — Unseen URL: search before you fetch

Run a `web_search` for the URL, or better, for distinctive terms from it (exact filename, model
number + brand + domain name). The exact same URL coming back as a search result makes it
fetchable — then `web_fetch` that result. This alone resolves a large fraction of "failed to
fetch" cases; it's not a workaround so much as the intended order of operations.

## Step 2 — Confirm it's not just a bad link

Before concluding a link is dead, try:
- Re-checking URL encoding — a filename with spaces should be `%20`-encoded; if the version you
  have isn't, or is double-encoded, try the corrected form
- The same file without a trailing query string or tracking parameter
- The containing folder/listing page instead of the deep link (dealer sites often reorganize file
  paths but keep a browsable listing — e.g. `supsew.com/download/Zoje/` even when a specific PDF
  URL 404s)
- A `web.archive.org` snapshot search for that exact URL, if it looks like it moved or was removed

## Step 3 — This domain is a dead end: pivot to a connected extraction tool, then mirrors

If a web-extraction MCP connector is connected, try it on the exact failed URL *before* spending
effort hunting for mirrors — these run their own scraping infrastructure and can succeed on
domains `web_fetch` cannot, since `ROBOTS_DISALLOWED` and JS-challenge walls are usually aimed at
generic bots, not at a service with its own fetch infrastructure.

This ladder has three sub-steps. Try them top to bottom — stop as soon as you have usable content
and report which rung you actually got it from (confidence differs between Tavily clean text,
local-PDF extraction, and mirror-search snippets).

### Step 3a — Tavily (always first)

1. **Tavily — `tavily_extract`** for a single known URL. This is the primary connector fallback.
   It runs its own scraping infrastructure, matches `web_fetch`'s speed and cleanliness on an
   easy document, and gets past hard `ROBOTS_DISALLOWED` blocks where `web_fetch` cannot —
   returning full document text, sub-second, no extra processing needed. Use this whenever you
   have a specific URL (a known PDF, a known spec sheet, a known manual page).
2. **Tavily — `tavily_crawl`** for multi-page discovery. Use this only when you don't have a
   specific URL yet and need to walk a site (e.g. discovering every PDF in a manufacturer's
   `/downloads/` directory). Don't use it for a single known document — that's `tavily_extract`.

If Tavily returns clean, complete text — use it. You're done with Step 3.

### Step 3b — Local PDF extraction via `mcp-pdf` (when Tavily fails or returns bad text)

If Tavily fails outright on the URL, or it returns text that looks garbled / incomplete / clearly
truncated (e.g. page-1 only of a 60-page manual, scrambled fragments, mid-paragraph cutoffs), take
a different route: **download the PDF directly to a local scratch folder and run `mcp-pdf` on it.**

Concretely:

1. Download the failed URL to a scratch folder in the working directory — e.g. `./downloads/`
   (create it if it doesn't exist). Use whatever direct fetch primitive is available
   (`curl`, `wget`, or a tool exposed by puku-cli's environment).
2. **Choose the right `mcp-pdf` tool based on what kind of PDF this is.** `mcp-pdf` does *not*
   silently escalate to OCR when the digital text layer is empty — its text tools use the
   embedded text layer only, and a scanned PDF comes back empty / useless if you ask for plain
   text extraction. The right tool depends on what the file actually is:
   - **`is_scanned_pdf` first when in doubt.** A single cheap call that tells you whether the
     document has a usable embedded text layer. Use the result to pick the next tool instead of
     guessing.
   - **Native digital PDF (most manufacturer catalogs, parts PDFs, modern manuals):**
     `textextraction__extract_text` — `method="auto"` (tries PyMuPDF first), `output_directory`
     set to `./downloads/`, `inline=False` to write to a `.txt` file. Read the file.
   - **Scanned PDF (older machines, photocopied manuals, anything predating the digital PDF
     era):** `textextraction__ocr_pdf` directly. Set `pages` if you only need a section,
     `languages=["eng"]` (or whatever's right), and `preprocess=True` for noisy scans.
     `output_directory` set to `./downloads/`.
   - **Mixed (some pages have digital text, others are scanned):** call `textextraction__extract_text`
     first. For any pages that came back empty/truncated, follow up with `textextraction__ocr_pdf`
     limited to those page numbers.
   - **PDF that needs to be paged through rather than scanned for one figure/number:** if the
     document is genuinely a parts-book with hundreds of pages and you only need a single spec
     page, prefer `pages` parameter (1-based, comma-separated) over a full extraction — this
     avoids huge output files.
   - **Large structured manuals where you want per-chapter output:** `structuredetection__batch_extract`
     with `sections` describing the page ranges you care about.
3. Use the returned text as your document content. Don't try to read the PDF yourself with a bare
   library (`pypdf`, `pdfplumber`, etc.) — `mcp-pdf` already handles the messy parts, and a hand-
   rolled parser will diverge from whatever the rest of the pipeline assumes.

**Working-files rule.** Files written to `./downloads/` (and any other scratch locations) are
*working files*, not deliverables:

- Treat them as throwaway. They're not part of the research output and shouldn't be referenced
  as if they were.
- Don't commit them to the project. If the project is git-managed, ensure `./downloads/` is
  covered by `.gitignore` (or only write to a system temp dir instead, e.g. the OS temp
  directory).
- Clean them up after extraction when feasible — they can be large and accumulate fast across
  multiple machines. Leaving them is acceptable for the current session; never letting them
  become permanent project artifacts is the actual rule.

If the *download itself* fails (URL is genuinely dead, the host blocks direct downloads, the
connection times out, etc.) — fall straight through to Step 3c. Don't keep retrying.

### Step 3c — Mirror search (when both Tavily and the direct-download path fail)

If Tavily failed outright AND the direct download in Step 3b also failed, search for the
document on a genuine mirror instead. Manual/parts-book PDFs for industrial machines are almost
always cross-hosted. Search for the exact document title/filename + model number and check, in
rough order of how fetchable they tend to be:

- `manualslib.com` — usually fetchable, large indexed library
- Manufacturer's own regional/official site — try directly even if a generic search didn't surface it
- Other dealer mirrors (search `<model> manual pdf -site:<blocked-domain>` to exclude the dead one
  and surface alternates you haven't tried yet)
- `directindustry.com` PDF catalogs — usually fetchable, good for catalog-style overview content
  even when it doesn't have the full manual
- Sites that list the document but gate it behind email capture or a JS-heavy viewer (allsewing.net,
  scribd.com) are **not usable as a fetch target**, but their listing pages still confirm the
  document exists and often show a genuine excerpt in the search snippet itself — see Step 4

If a mirror returns a clean fetchable URL, you can restart the ladder at Step 3a on that mirror's
URL rather than treating it as a dead end — many dealer-hosted PDFs are not robots-blocked in
the same way the original URL was.

If no mirror exists at all and no connector is available/successful, that's a real, reportable
finding — say the document doesn't appear to be freely available online, don't keep spinning.

### Step 3 summary

In order: **3a Tavily → 3b local-PDF extraction via `mcp-pdf` → 3c mirror search**. Don't skip
steps (e.g. downloading when Tavily already gave you clean text wastes a round trip). Don't
loop within a sub-step if it fails once — fall through to the next rung instead.

## Step 4 — Squeeze more out of search snippets when nothing is fetchable

When a source is confirmed unfetchable (Step 3) but keeps surfacing in search results, its snippet
is your only content from that source — but a single search call often only surfaces one excerpt
of a longer document. Running a couple of *differently worded* searches against the same blocked
source (e.g. quoting a distinctive phrase you already got back, or searching for a section you
haven't seen yet like "<model> specifications" vs "<model> maintenance") can surface different
excerpts of the same underlying PDF across multiple result snippets. This is genuinely
lower-confidence than full-text access — treat it accordingly (see Step 5) and say so in your
report.

## Step 5 — Flag low-confidence text, especially numbers

Badly-scanned PDFs produce garbled OCR — watch for tell-tale signs like broken words, stray
punctuation mid-word, or obviously swapped characters (`"tunc;ions"` for "functions", `"Man~al"`
for "Manual"). If you're pulling a *number* — a speed, a voltage, a tolerance — out of text that
shows this kind of corruption elsewhere, don't treat it as verified. Either find a second, cleaner
source for that specific figure, or mark it as unconfirmed rather than reporting a possibly-corrupted
digit as fact. This matters most for tasks (like machine spec research) where a single wrong digit
in an otherwise-clean-looking record is worse than an honest gap.

### OCR confidence thresholds (Step 3b source)

When the text comes from `mcp-pdf`'s `textextraction__ocr_pdf` or related OCR tool, the response
includes a per-page and overall confidence score (Tesseract's `pytesseract.image_to_data` averaged
confidence, expressed as a percentage 0–100). Apply these thresholds as a hard gate:

- **≥ 80% confidence** — treat as digital-equivalent text. Numeric specs from this text can be
  reported as "OCR-extracted" and feed into Phase 2 verification like any other source.
- **60–79% confidence** — usable prose, **numbers must be cross-checked**. Never report a numeric
  spec (speed, voltage, tolerance, dimension) from this band as verified without an independent
  second source — pull it from the manualslib.com mirror, the manufacturer's own site, or another
  OCR pass with different preprocessing. If no second source exists, mark the number as
  `unverifiable (OCR < 80%)` and say so in the verification notes.
- **< 60% confidence** — treat as low-trust overall. Cross-check non-numeric claims too, not
  just numbers, and prefer searching for the same content from a different source before
  reporting it as fact.
- **Silent-failure caveat.** `mcp-pdf` returns `success: true` even when OCR fails on every page
  (e.g. Tesseract missing from PATH). Always read the per-page `pages_failed` count and the
  overall confidence value — `success: true` with 0 successful pages is an OCR-not-actually-ran
  outcome, not a result.

## Step 6 — Report honestly, and know the best fallback

After working the ladder, tell the user plainly:
- What you actually got, and from which rung (a direct fetch of the primary source reads very
  differently in confidence terms than "pieced together from search snippets of a source I
  couldn't fetch directly")
- Which specific domains were dead ends and why (robots-blocked, JS-gated, email-gated) — this
  saves the user re-suggesting the same link
- If nothing usable was found anywhere: say so directly rather than presenting a thin result as if
  it were complete

The single most reliable fallback, and worth surfacing whenever a source turns out to be
unfetchable: **ask the user to upload the file directly into the chat.** Uploaded PDFs — including
scanned ones — are read natively and are not subject to any of the robots/permissions/JS-challenge
restrictions that block automated web fetching. If a document exists but every hosted copy is
blocked, that's the fastest real path to it, not a consolation prize.
