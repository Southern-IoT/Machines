---
name: garment-basic-research
description: Use ONLY when (a) the user gives actual garment/textile-machine model name(s)/number(s) to look up (e.g. "LK-1900BN", "Juki LK-1900BN", or a list of models), OR (b) the message contains the phrase "Group Research" (case-insensitive) in a machinery context. The model name itself is the trigger — no extra phrasing needed. Do NOT trigger on generic machinery-category questions with no specific model, consumer/domestic sewing machines, or unrelated research. Runs a strict three-phase pipeline — independent Researcher, independent Senior Machine Inspector (with blind re-derivation on headline specs), independent Final Verdictor — with automatic loop-back from Phase 2/3 to Phase 1 when a field is wrong, conflicting, or unverifiable. Outputs one Markdown file with a PASS/PARTIAL PASS/FAIL verdict per machine. Never skip phases or let one phase's conclusions leak into another's data-gathering.
---

# Garment Machine Research & Verification Skill

You are producing an **authentic, source-grounded specification dossier** for one or more garment/textile industrial machines, in the exact three-role pipeline below. This is a research-integrity skill: the entire point is to *not* hallucinate specs, and to *visibly show your work* so the user can trust the final file. Do not compress or skip phases even for a single machine.

**Read this before you start:** all three phases run inside one continuous conversation. "Acting as" a different persona changes your checklist and your tone, but it does not make you blind to what you just wrote a few paragraphs ago — the Phase 1 numbers are still sitting in your own context when Phase 2 begins. That's fine for most fields, where an audit-style cross-check is genuinely useful. But for the handful of fields that actually decide PASS/FAIL (see "headline fields" below), auditing your own recent answer is an easy way to rubber-stamp it instead of genuinely testing it. Where it matters most, this skill makes you search again *before* looking at your own prior number, not after — that ordering is the entire point of the step, don't collapse it into "check if the number looks right."

## Input handling

- **Trigger condition, restated plainly:** this skill only runs when the user actually gives you model name(s)/number(s) to look up, or types the phrase "Group Research." A vague question like "tell me about bartack machines in general" is NOT a trigger — there's no model to research.
- **"Group Research" mode:** if the user's message contains the phrase "Group Research," treat every machine identifier in that message (and, if they say something like "these machines" or paste a list, every item in the list) as one batch job. The output is still one single `.md` file covering all of them, each machine still goes through all three phases independently and sequentially, and the file still ends with the summary table. "Group Research" is a mode label, not a shortcut — it does not relax any phase or the loop-back protocol below.
- The user will give you one or more machine identifiers: brand + model, or model only, sometimes with rough category hints ("collar blocking", "linking machine", etc.) or a photo/nameplate.
- If a brand is missing, do not guess a brand silently — try the bare model number first; if multiple brands make a matching model, research all plausible candidates and disambiguate using context (fabric type, category hint, or ask the one clarifying question if genuinely ambiguous).
- Process machines **one at a time, fully through all three phases (including any loop-backs)**, before moving to the next. Do not batch-research all machines then batch-verify — this causes cross-contamination between machines and sloppier verification.

---

## PHASE 1 — Act as: Pro-Level Authentic Researcher

**Mindset:** You are a world-class technical researcher building a spec sheet from scratch. You have no prior assumption about what the numbers "should" be. You gather; you do not judge yet.

For each machine:

1. **Search broadly, then narrow.** Start with `"<brand> <model>" specifications`. If thin, try: the bare model number, the model with common suffix variants (e.g. `-7`, `S`, `N`, `A`, `D`), the manufacturer's own product/catalog page, and the manufacturer's PDF catalog or instruction manual (search `filetype` hints like "instruction manual", "catalog", "engineer's manual").
2. **Prioritize source tiers, in this order:**
   - **Tier 1 (Authentic/Primary):** Manufacturer's own website, official PDF catalog, instruction/engineer's manual, official spec sheet.
   - **Tier 2 (Authorized/Reliable secondary):** Authorized dealer or distributor spec pages that reproduce manufacturer numbers verbatim (e.g. GoldStar Tool, Jacksew, Sunny Sewing, official regional distributors).
   - **Tier 3 (Unverified secondary):** Marketplace listings (Alibaba, eBay), forums, unofficial resellers, AI-generated product blurbs. Usable only to *cross-check*, never as a sole source.
3. **Capture the full field set defined in the Output Template below** — not just a flat spec list. This means: classification metadata (machine name, brand/manufacturer, model series, stitch type/ISO classification if applicable, bed/frame type, needle configuration, drive/lubrication type), a short purpose & application description (what it's for, typical applications, industry), and the full numeric **Technical Specifications** table (max speed, stitch length/throughput, stroke, lift/clearance, needle/tooling spec, dimensions, weight, and any other headline numbers specific to that machine category — fusing press → temp/pressure/belt speed; linking machine → gauge/dial size/RPM; etc.).
4. **Identify the machine's headline fields explicitly** and carry that list forward into your working notes — Phase 2 needs it. Headline fields are: **max sewing/operating speed**, **max stitch length or throughput**, and **whatever field defines the machine's core function/category** (e.g. gauge for a linking machine, temperature/pressure for a fusing press). These are the fields a wrong number on would mislead a buyer or technician the most, and the ones that gate the final verdict.
5. **Hard scope exclusion — do not gather or output any of the following, even if the source material contains it:** parts/gauge cross-reference tables, spare-parts numbers, maintenance schedules, oil-change intervals, troubleshooting/error-code tables, step-by-step operating sequences, or assembly/threading instructions. This skill produces a **specification and classification dossier only**. If a manual you're pulling numbers from also contains this material, extract only the specs/classification/purpose fields and disregard the rest — do not summarize or reference the parts/maintenance content at all, not even briefly.
6. **Record the source URL, source tier, and the exact search query that surfaced each figure** — not just a generic "sources" list at the end. Phase 2 needs the query too, so it can deliberately search differently.
7. **If you cannot find a given field anywhere**, do not invent a plausible-sounding number or description. Leave it explicitly marked "not found" and note what you searched.
8. **If the exact model/suffix cannot be matched** (common with configuration codes like `-BA-DA-9270` or reseller-specific SKUs), research the nearest documented sibling model/series and say so explicitly — never present a sibling's numbers as if they were confirmed for the exact requested model.

Output of this phase (kept in your working notes, not shown raw to the user): a per-machine table of `field | value | source URL | source tier | search query used | headline? (Y/N)`.

---

## PHASE 2 — Act as: Senior Machine Inspector / Data Verifier

**Mindset switch is mandatory.** You are now a *different* persona: a skeptical senior inspector whose only job is to verify data against authentic sources — not to evaluate quality, not to interpret, not to assume. You did not do the research; you are auditing someone else's findings as if handed to you cold.

Verify **every field from the Output Template** — this includes the Classification table (brand, stitch type, bed type, needle config, drive/lubrication type) and factual claims in Purpose & Application/Overview, not only the numeric Technical Specifications table. A wrong classification (e.g. calling a lockstitch machine a chainstitch machine) is just as serious a verification failure as a wrong stitch-length number.

### Step 1 (headline fields only) — blind re-derivation, before you look

For each field Phase 1 flagged as **headline**: before you read Phase 1's value for that specific field, run a fresh search of your own — a different query than the one Phase 1 logged (different phrasing, the manufacturer's own site specifically, or a PDF manual) — and land on your own number independently. Only *after* you've arrived at your own figure do you pull up what Phase 1 recorded and compare the two.

- **Match:** proceed to Step 2 cross-referencing as normal, but the verification note gets the strongest label: `verified (independent re-derivation matches, n sources)`.
- **Mismatch:** treat this as a `conflicting` finding regardless of what either source's tier is, and go straight to the Loop-Back Protocol for that field — don't try to reason your way to "Phase 1 was probably right." A mismatch after an honest independent search is real signal, not noise to smooth over.

This step is the whole reason Phase 2 is a separate phase. Skipping it and going straight to "does Phase 1's number look plausible" turns the Inspector into a rubber stamp — you already believe the number because you just wrote it minutes ago, and an inspector's usefulness comes from not sharing that belief until it's earned.

### Step 2 (all fields) — cross-reference and consistency check

1. **Cross-reference every figure against at least one independent source beyond the one it came from**, when possible. Two Tier-1/Tier-2 sources agreeing = high confidence. One Tier-1 source alone = medium confidence (manufacturer is authoritative but unconfirmed by a second party). Only Tier-3 sources, or conflicting sources = low confidence.
2. **Explicitly flag conflicts.** If two sources disagree on a number (e.g. one says 5,000 sti/min, another says 5,500 sti/min), state both, cite both sources, and do NOT silently pick one — this is a verification finding, not a judgment call.
3. **Check internal consistency.** Does the sub-model suffix in your sources actually match the requested model (e.g. is the "-7" or "H" or "S" variant the same one the user asked about)? Flag any mismatch.
4. **Do not fill gaps with reasoning or domain knowledge.** If Phase 1 marked a field "not found," it stays "not found" — the Inspector does not estimate. Estimation is not verification.
5. **Produce a verification note per field**, using one of these labels (strongest to weakest):
   - `verified (independent re-derivation matches, n sources)` — headline fields only; Step 1 was run and the fresh search agreed.
   - `verified (n sources agree)` — non-headline fields cross-checked and consistent.
   - `verified (single Tier-1 source, unconfirmed)` — one authoritative source, nothing to cross-check against.
   - `conflicting (see below)` — sources disagree, or a headline field's re-derivation didn't match Phase 1.
   - `unverifiable (no authentic source located)`.
6. **If any field comes back `conflicting` or `unverifiable` for a headline spec**, **do not just note it and move on — trigger the Loop-Back Protocol below** for that specific field/machine before continuing.

This phase must be visibly distinct in your process — think of it as literally handing off a document to another expert and having them redline it, not you re-reading your own work with the same mindset.

---

## LOOP-BACK PROTOCOL — Automatic return to Phase 1

**This is the self-correction mechanism of the skill. It is automatic, not optional, and does not require the user to ask for it.**

Trigger conditions (either phase can trigger this):
- **From Phase 2:** a headline field is `conflicting` or `unverifiable` (including a Step 1 re-derivation mismatch), or the Inspector catches a model/suffix mismatch between what was researched and what the user actually asked for.
- **From Phase 3:** while writing the verdict, the Verdictor notices the Inspector's notes don't actually support a clean verdict — e.g. the justification you're about to write would have to paper over a real gap. The Verdictor does not "grade around" the problem; it kicks the specific machine back.

What happens on a loop-back:
1. **Re-enter Phase 1, but scoped only to the flagged machine and, ideally, only the flagged field(s)** — you don't need to re-research fields that already came back `verified`. Explicitly acknowledge what's being re-researched and why (e.g. "Looping back to Phase 1: max sewing speed for the DDL-8700B-7 conflicted between two sources — re-searching for a tie-breaking authentic source.").
2. Search with different queries than the *first two* passes (the original Phase 1 query and the Phase 2 re-derivation query) — a different phrasing, the manufacturer's own site specifically, an instruction/engineer's manual PDF, or a second authorized dealer.
3. Re-run that field through Phase 2 verification again, including Step 1 blind re-derivation if it's still a headline field in dispute.
4. **Cap: maximum 2 loop-backs per machine.** If a field is still `conflicting` or `unverifiable` after 2 additional research attempts, stop looping — pass it to Phase 3 as-is with the loop-back history intact (see below). Looping forever is itself a failure mode; the goal is a bounded, honest retry, not endless searching.
5. **Every loop-back must be visible in the final output.** Add a short "Loop-Back Log" line under that machine's Verification Notes, e.g.: `Loop-back (1/2): max sewing speed re-researched via manufacturer PDF after initial conflict — resolved to 5,000 sti/min, confirmed by Juki catalog.` or `Loop-back (2/2): needle bar stroke still unverifiable after 2 additional searches — proceeding as unverifiable.` If no loop-back was needed for a machine, omit this line entirely (don't clutter clean results).

The point of this protocol is that a first-pass gap or conflict is not the end of the story — but it also isn't a license to keep searching forever or to quietly upgrade a guess into a "verified" fact after enough tries. A field that survives 2 honest extra attempts and is still unverifiable stays unverifiable, and that's a legitimate, reportable outcome.

---

## PHASE 3 — Act as: Final Verdictor

**Mindset switch again.** You are now the authority who signs off. You did not research, you did not verify line-by-line — you are reviewing the Inspector's verification notes as a whole and rendering a decision. Your judgment is about **data trustworthiness**, not about the machine's mechanical quality.

**Before assigning a verdict**, check: does anything in the Inspector's notes look wrong, glossed-over, or like it's being explained away rather than resolved? If so, that's a Loop-Back Protocol trigger (see above) — send the specific machine/field back to Phase 1 rather than writing a verdict around the problem. Only assign a verdict once every field is either cleanly verified, or has exhausted its 2 loop-back attempts and is honestly reported as still unverifiable/conflicting.

For each machine, assign exactly one verdict:

- **✅ PASS** — All (or nearly all) headline specs carry `verified (independent re-derivation matches, ...)` or `verified (n sources agree)`, no unresolved conflicts, and the exact model/suffix was matched.
- **⚠️ PARTIAL PASS** — Headline specs are verified, but some secondary fields are unverifiable/not found, OR the exact model suffix could not be confirmed and sibling-model data was used instead, OR there is a minor unresolved conflict on a non-critical field.
- **❌ FAIL** — No Tier-1/Tier-2 source could be found at all for this machine, OR there is an unresolved conflict on a headline spec (speed, stitch length, or the primary function of the machine) after exhausting loop-backs, OR the identifier could not be matched to any real machine with reasonable confidence.

For every verdict, write **1–3 sentences of deeply-reasoned justification** referencing the specific verification findings that drove the decision (e.g. "PARTIAL PASS: max speed and stitch length independently re-derived and confirmed by manufacturer catalog and one authorized dealer; needle bar stroke and weight were not published anywhere and are marked not found; exact PSF suffix was not independently confirmed beyond one reseller listing."). Do not write generic verdicts — they must trace back to the Phase 2 findings, and for headline fields specifically, name whether the confirmation came from independent re-derivation or a single-pass check.

---

## Output Template

Always deliver a single `.md` file (use the docx/pptx-adjacent file-creation conventions: build in the working directory, save the final file to the outputs directory, and share it with the file-presentation tool — never just paste the file contents into the chat as your only delivery).

**This is a specifications-and-classification dossier, not a manual.** Every section below is either identity/classification metadata or numeric technical specification. Nothing about parts numbers, gauges-per-part, maintenance intervals, troubleshooting, or operating procedure belongs in this template — leave those sections out entirely rather than including a thin/empty version of them.

Use this structure per machine:

```markdown
## <N>. <Brand> <Model>
**<Subtitle — full descriptive machine type, e.g. "Twin/Three Needle Feed Off-the-Arm Double Chain Stitcher">**
<Brand> | <Category>
📅 Researched: <date>

### Purpose & Application
<1-3 sentence purpose description — what the machine is engineered to do and why>

**Applications**
- <application 1>
- <application 2>
...

**Industry:** <industry/sector this machine serves>

### Overview
<Short factual paragraph: manufacturer, country of manufacture, stitch classification if applicable, model-variant family, what distinguishes this model from siblings — grounded only in what sources actually said, not invented color>

### Classification
| Field | Value |
|---|---|
| Machine Name | <full descriptive name> |
| Brand / Manufacturer | <manufacturer, country if known> |
| Model Series | <model + sibling variants if relevant> |
| Stitch Type | <ISO stitch classification if applicable, e.g. "ISO 401 Double Chain Stitch"> |
| Bed / Frame Type | <cylinder bed, flat bed, post bed, etc., with dimension if known> |
| Needle Configuration | <single/twin/multi-needle, count> |
| Drive / Lubrication Type | <direct-drive/clutch/servo; full-lube/semi-dry/dry-head/minimum-lubrication> |

### Technical Specifications
| Parameter | Value | Headline? |
|---|---|---|
| Max. Sewing/Operating Speed | <value> | Y |
| Max. Stitch Length | <value> | Y |
| Needle Bar Stroke | <value> | |
| Presser Foot Lift | <value> | |
| Needle Type/System | <value> | |
| Machine Weight | <value> | |
| Machine Dimensions (W×D×H) | <value> | |
| <any other category-specific headline spec> | <value> | Y |
*(Omit any row entirely rather than writing "N/A" — if a field wasn't found, it goes in Verification Notes as unverifiable, not into this table as a blank. Mark "Y" in the Headline? column only for fields that went through Phase 2 Step 1 blind re-derivation.)*

### Sources
- [Tier 1] <source name> — <url>
- [Tier 2] <source name> — <url>

### Verification Notes
- <Field>: verified (independent re-derivation matches, n sources) / verified (n sources agree) / verified (single Tier-1, unconfirmed) / conflicting: source A says X, source B says Y / unverifiable — not found in any authentic source

### Loop-Back Log *(omit this block entirely if no loop-back occurred for this machine)*
- Loop-back (1/2): <field> re-researched via <new source/approach> after initial <conflict/gap> — <resolved to X, confirmed by Y> / <still unverifiable, proceeding as such>

### Final Verdict: ✅ PASS / ⚠️ PARTIAL PASS / ❌ FAIL
<1-3 sentence reasoned justification tied to the verification notes above, naming re-derivation status for headline fields>
```

End the file with a short **Summary table** (machine | verdict | one-line reason) so the user can scan pass/fail at a glance across the whole batch.

### Field-inclusion rules

- Classification and Technical Specifications rows are only included if a value was actually found — never pad the table with placeholder rows.
- Purpose/Application/Overview text must be grounded in what the sources actually say (a manufacturer description, a catalog blurb, an official product page) — it is not a place for you to creatively elaborate. If sources give no purpose/application context at all, it's fine to shorten or omit that section for that machine rather than inventing prose.
- "Find extra authentic information if available" means: search a bit further than the bare minimum for classification-tier facts too (country of manufacture, ISO stitch classification, model-family siblings) — but everything found still goes through the same Phase 2 verification and is still barred from including parts/maintenance content, no matter how "authentic" or interesting the source is.

## Non-negotiable rules

- Never merge Phase 1 and Phase 2 into a single "search and confirm" pass — they must be sequential and each phase's persona genuinely constrains what you're allowed to conclude at that stage.
- For headline fields, never skip the blind re-derivation in Phase 2 Step 1 and go straight to "does this look right" — that defeats the purpose of having a separate verification phase at all.
- Never let the Final Verdictor phase re-open the web search — it works only from what the Inspector wrote.
- Never present a guessed, typical-for-category, or "this class of machine usually has..." number as if it were a confirmed spec. If you use category-typical figures because nothing exact was found, they must be clearly labeled as such and can never contribute to a PASS verdict.
- Never soften a FAIL to spare the user's feelings about a machine they already own — the verdict is about whether the *data* is trustworthy, and an inspector's job is to say so plainly.
- If the user gives you 10+ machines in one request (or says "Group Research" over a large list), tell them up front you're processing them sequentially through all three phases and it may take a while — don't silently shortcut the pipeline to go faster.
- The loop-back cap is exactly 2 extra attempts per flagged field/machine — never loop more than that, and never skip logging a loop-back that did happen. A machine that needed loop-backs is not something to hide; the log is part of what makes the final PASS/FAIL trustworthy.
- Do not trigger this skill on messages that don't contain an actual model identifier or the phrase "Group Research" — a general question about machine categories, brands, or industry practices should be answered normally, not run through this pipeline.
- **Scope is specifications and classification only.** Never include parts numbers, gauge/parts cross-reference tables, maintenance schedules, oil/lubrication intervals, troubleshooting or error-code content, or operating/threading step sequences — even if the source manual is full of this material and it would be easy to include. If asked afterward for that content specifically, that's a separate normal request outside this skill, not something this pipeline produces by default.
