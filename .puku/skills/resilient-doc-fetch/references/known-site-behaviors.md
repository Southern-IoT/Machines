# Known site behaviors

Observed directly (not assumed) during real fetch attempts. Treat this as a fast first guess, not
gospel — sites change robots.txt, paywalls, and anti-bot measures over time, so if something here
seems stale or a fetch behaves differently than described, trust the live result and mentally
update this list rather than arguing with reality.

## Confirmed blocked / unfetchable

- **supsew.com** (Superior Sewing Machine & Supply) — `ROBOTS_DISALLOWED` via `web_fetch` on every
  PDF path tested (`/download/Zoje/...`), not just one file — the whole domain is unfetchable
  through that tool, not just the specific URL that failed. **Tested all three connected
  extraction connectors on this exact block, same document, for comparison:**
  - Tavily (`tavily_extract`) — succeeded, 0.03s, full document, clean text. Best option for this
    failure mode.
  - Nimble (`nimble_extract`) — succeeded, but only on a 2nd attempt (1st timed out at 300s), and
    returned the raw PDF as base64 (~6.4M characters) rather than parsed text — required manual
    decode + local PDF parsing.
  - Exa (`web_fetch_exa`) — succeeded but capped at default 3,000 characters, returning only the
    first page or so of a 53-page document — not useful for full-document retrieval here.
  Their search-result snippets are still often useful on their own too, and are genuine extracted
  PDF text (just sometimes OCR-garbled) — usable as a lower-confidence source, not as a primary
  one, if no connector is available at all.
- **scribd.com** — serves a "Client Challenge" / JavaScript-required interstitial to automated
  fetches. Search snippets from Scribd listing pages are usually just the marketing blurb, not the
  document body, so they're low-value here even as a fallback.

## Confirmed fetchable but content-gated

- **allsewing.net** — the site itself and its manual listing/detail pages fetch fine, but the
  actual PDF download on a manual's detail page requires submitting an email address ("Add your
  email and we'll send you a secure download link"). Don't submit a form or invent an email on the
  user's behalf. The detail page is still useful for *confirming a manual exists* and sometimes for
  a thumbnail/cover image, just not for full-text content.

## Generally fetchable (no issues observed)

- **manualslib.com** — indexed library, fetches normally, good breadth across brands.
- **directindustry.com** / **pdf.directindustry.com** — catalog PDFs fetch normally.
- **manufacturer official sites** (juki.com, brother-usa.com /
  industrialsewingmachine.global.brother, hashima.co.jp, kansai-special.com) — fetch normally when
  the page is found; the harder part with these is discovery (regional domains, romanization) not
  access, once found.
- **manualmachine.com** — fetches normally, but pages are template-heavy (long sidebar model
  lists); the actual manual content on a given page can be a small fraction of what's returned, so
  check you're reading the substantive part and not just the model-index sidebar.

## Pattern to watch for generally

Dealer/reseller sites that primarily exist to sell machines or parts (rather than to host
documentation as their core purpose) are more likely to gate PDFs behind lead-capture forms or
block automated access outright — documentation is a marketing draw for them, not the product.
Manufacturer sites and pure documentation aggregators (manualslib-style) are more likely to serve
content freely since that's their actual business.
