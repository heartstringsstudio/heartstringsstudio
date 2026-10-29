# Heartstrings Studio — Website Audit (August 25, 2026)

*Read-only audit of the main site source plus all live satellite properties, read
from their repos: `storyroom`, `jukebox`, `song-quiz`, `sortingporch`, and
`keepsakes`. The live GitHub Pages URLs could not be fetched from this
environment (network policy), so everything here is from source — which is the
same code Pages serves. Line numbers refer to each repo's current default
branch. This supersedes the July 9 audit in `AUDIT.md`; items it marked done
were re-verified and remain fixed unless noted.*

---

## Executive summary

- **The occasion deep-links are dead.** All nine homepage occasion pills pass
  `?occasion=…` to the Story Room, but `storyroom/app.js` never reads the URL —
  every click lands on the generic welcome screen. CLAUDE.md documents this
  pre-fill as a feature; it has never worked in the current Story Room. This is
  the single highest-value fix on the list.
- **The funnel leaks at the seams, not the pages.** The song quiz's only CTA is
  a `mailto:` link (never the Story Room); the Jukebox's "Commission Your Song"
  routes through tinyurl back to the *homepage* instead of the Story Room; and
  delivered keepsake pages do the same. Each page is good; the handoffs between
  them lose people.
- **Analytics go dark at the exact moment that matters.** GA4 runs only on the
  homepage. The Story Room has a literal `<!-- GA4: paste tag here -->`
  comment, and the Jukebox, quiz, and keepsakes have nothing — so `generate_lead`
  (a click) is the last thing ever measured, and form completion rate is unknowable.
- **Keepsake operations have forked.** There are now two keepsake builders (one
  per repo) that have drifted apart, and the delivered keepsake examined
  (`keepsakes/she-left-us-a-party/`) is missing the MP3 and lyric-sheet
  downloads that `KEEPSAKE-OPERATIONS.md` requires and the homepage pricing
  card promises.
- **The homepage itself is in strong shape** — the July fixes held, the brand
  guardrails are clean (no AI framing, no guitars, jukebox is the listen CTA),
  and accessibility/reduced-motion work is genuinely good. The memorial
  free-24-hour-rush promise, however, appears nowhere on it — the audience that
  most needs reassurance is told rush costs $50 extra.

---

## Page-by-page findings

### Site inventory

| Property | Source | Status |
|---|---|---|
| Homepage | `heartstringsstudio/index.html` (2,792 lines, single file) | Live, indexed |
| Story Room (intake) | `storyroom/` repo (`index.html` + `app.js` + `styles.css`) | Live, the conversion endpoint |
| Studio Jukebox | `jukebox/` repo (`index.html` + `songs.json`) | Live |
| Song quiz | `song-quiz/index.html` | Live |
| Sorting Porch | `sortingporch/index.html` | Live, internal tool, **not noindexed** |
| Delivered keepsakes | `keepsakes/` repo — 7 client pages + a second `keepsake-builder.html` | Live, noindexed |
| Keepsake Builder (studio tool) | `keepsake-builder.html` (main repo) | Noindexed; **superseded in practice by the keepsakes-repo copy** |
| `keepsaketemplate.html` | Main repo | Retired stub pointing at the builder — fine |
| `sheleftusaparty.html` | Main repo | Unfinished orphan (see below) |

### Homepage (`index.html`)

**Good:** The flow (hero → proof → trust strip → weekly song → difference →
WBOY → early CTA → occasions → listen → keepsake → process → pricing →
testimonials → bio → FAQ → close) answers objections in roughly the order a
first-time buyer forms them. All 19 `/storyroom/` links and 5 jukebox links are
correct and GA-tracked. `scroll-padding-top: 80px` (line 300), real social
`href`s with `rel="noopener noreferrer"` (2485–2488), FAQ intake links
(2436, 2440), and the raised fine-print opacities all held from July.

Issues, roughly top-to-bottom of the page:

1. **No price above the fold.** The hero (2024–2044) shows logo, wordmark,
   eyebrow, headline, tagline, two CTAs. `$150` first appears in the start
   strip (2139), four sections (~3,000px) down. The meta description leads with
   the price; the visible page doesn't.
2. **Two competing hero CTAs.** "Commission Your Song" (2034) and "Hear the
   Songs" (2037) sit side by side; the ghost style keeps hierarchy, but on a
   396px screen they stack and push "Hear this week's song ↓" below the fold.
3. **Occasion pills promise a pre-fill that doesn't happen** (2155–2163) — see
   Category 6.
4. **Pill labels don't map to Story Room paths.** "Birthdays" and "Retirements"
   → Story Room "Milestone"; "Just Because" and "Gratitude & Thank You" have no
   path at all (closest is "Tribute"); "Military Tributes" → "Tribute". When the
   `?occasion=` wiring is fixed, these strings ("Birthday", "Military%20Tribute",
   etc.) won't match the Story Room's six keys (`memorial`, `celebration`,
   `wedding`, `milestone`, `tribute`, `holiday`) without a mapping table.
5. **The keepsake preview mock renders 8–8.5px type**
   (`.keepsake-brand-type` 8.5px, line 1064; `.keepsake-art-meta` 8px, line
   1131). It's a decorative mock, but "Personal keepsake" is real read matter at
   an illegible size on a phone.
6. **"Investment" as the nav and section label** (2017, 2319) reads like agency
   language for an audience of everyday WV families. "Pricing" is the honest,
   on-tone word — the pricing card itself already talks plainly.
7. **The memorial free-rush promise is absent.** Pricing note (2340): "Rush
   delivery available for an additional $50" — no memorial exception. FAQ #2
   (2440): same. The 48–72h stat (2055) is the only turnaround on the page. A
   grieving visitor with a service on Friday reads this page as "rush costs
   $50," when the actual policy (stated only deep inside the Story Room's
   memorial path, `app.js` `presend`) is free 24-hour delivery. Per the brand
   guardrails, 24-hour language belongs next to memorial offerings — right now
   it's next to none.
8. **Six YouTube iframes** (2083, 2121, 2183, 2195, 2203, 2211) are all real
   embeds (lazy-loaded, which helps). The Jukebox already solved this correctly
   with thumbnail facades that only inject the iframe on tap — the homepage
   should borrow that pattern; each activated embed pulls ~500KB+ of YouTube JS
   on the connections rural WV visitors actually have.
9. **Font payload:** line 255 requests 10 Cormorant Garamond variants, 6
   Playfair Display, 3 Lato. Playfair is used only for buttons/`--serif-alt`
   accents. Half of these weights are never used.

### Story Room (`storyroom/`)

**Good:** This is the best copy in the whole operation — "Fragments are where
songs begin," "Nobody else packed a lunch pail quite like that," per-occasion
question sets, a memorial track that leads with the free 24-hour promise, a
send-failure path that preserves the story and offers "Copy my story."
Accessibility is real (focus management per screen, `aria-labelledby`,
sessionStorage draft that's cleared after send). Formspree endpoint over HTTPS.

Issues:

1. **`?occasion=` is ignored** — no `location.search`/`URLSearchParams`
   anywhere in `app.js`. Fix is ~10 lines: read the param, map it to an
   occasion key, jump to that track's first question.
2. **No analytics at all** — `index.html` line 20: `<!-- GA4: paste tag here -->`.
   No `page_view`, no completion event. The entire funnel below the homepage
   click is unmeasured.
3. **Price appears only on the final review screen** (`renderReview`, the
   `pricing` variable). Anyone arriving directly (from a keepsake page,
   Facebook, or the quiz once it links here) answers 9–10 questions before
   learning the cost. One quiet line on the welcome screen ("Every song is a
   flat $150") would remove the ambush.
4. **No payment step or mention of how payment works** anywhere in the flow —
   "you'll be contacted within 24 hours" carries all the weight. Deliberate?
   (See open questions.)
5. **Both escape hatches route through tinyurl** — the `noscript` block and the
   footer link, and the done-screen's "Back to Heartstrings Studio." You don't
   control tinyurl; link the site directly.
6. **No OG tags, no canonical, no real favicon file** — a Story Room link shared
   on Facebook renders as a bare grey card, and this is the page most worth
   sharing to a widow's group or family thread.
7. **Brand drift (mild):** body font is Nunito Sans (site uses Lato), rose is
   `#b34760` (site: `#c0455a`), rounded 14px radii and pill buttons vs. the
   site's square corner-bracket aesthetic. Same warm family, different house.

### Studio Jukebox (`jukebox/`)

**Good:** The most on-brand satellite — it imports the site's tokens verbatim
(its CSS opens with "Palette + type mirror the main site"). Thumbnail-facade
playback, `youtube-nocookie.com` embeds, offline fallback, spotlight synced to
the homepage's weekly song ("Two Weeks In The Kitchen" matches
`index.html:2083`), keyboard Escape to stop, honest empty states ("yours could
be the first").

Issues:

1. **Header CTA "Commission Your Song" → `https://tinyurl.com/heartstringswv`** —
   i.e., a redirect to the *homepage*, not the Story Room. A listener who's sold
   after three songs is dropped at the top of the marketing page they may have
   just come from, to scroll and find another CTA. This should be
   `/storyroom/`, and it's the only commission CTA on the page.
2. **No GA4** — `hear_songs` clicks from the homepage are tracked, but what
   people play, and whether they click Commission, is invisible.
3. **No `og:image`** — the quiz repo's own comment explains Facebook renders a
   grey box without one; the Jukebox has exactly that problem.
4. **No link back to the Story Room anywhere** (footer links are email + main
   site).
5. Nit: the "holiday" filter is labeled "Other," but the songs under it are
   Mother's Day/Father's Day/July 4th — "Holidays" would sell better than
   "Other."

### Song quiz (`song-quiz/`)

**Good:** Smart structure (memorial answers lock the quiz into a tender track so
nobody grieving is handed a party song — the code comments say exactly this),
excellent a11y (real radiogroup, roving tabindex, live region), shareable
results via `?song=` with validation, a genuinely nice downloadable 1080×1080
keepsake card.

Issues:

1. **The conversion CTA is `mailto:` only.** `#btn-commission` — "Start a
   Conversation" — opens an email draft. The Story Room exists precisely so
   people don't have to compose a cold email; on mobile (this audience), mailto
   frequently opens nothing usable. The quiz never links the Story Room at all;
   its footer links tinyurl and email.
2. **It's a different brand.** Crimson `#9c1c30` on blush, Playfair
   Display + Lora, and a *different logo* (an SVG recreated "from the studio
   business card"). The file's own comments say the tokens were sampled from
   print materials. So the print brand and the web brand now both live online,
   and a visitor moving quiz → site sees two studios.
3. **Offer copy contradicts the site:** the price block says "custom album art,
   and a **printed** lyric sheet" — the site sells a *downloadable* lyric sheet
   and never promises print/mail — and the quiz never mentions the keepsake
   page, which is the actual differentiator.
4. **The homepage never links the quiz.** It's reachable only from social. If
   it converts, it deserves a link (e.g., near the occasions section); if it
   doesn't, it's a maintained orphan.
5. No GA4 here either.

### Sorting Porch (`sortingporch/`)

An internal intake-to-brief tool, competently built — but:

1. **It is not noindexed.** No `<meta name="robots">` at all, unlike the
   keepsake builder. Its meta description announces "Internal intake-to-brief
   converter for Heartstrings Studio," and an option in the UI reads "General
   AI · Develop the song package" (line 360). If Google indexes it, a client
   searching the studio name can land on the internal tooling and its AI
   framing — a direct brand-guardrail exposure. One meta tag fixes it.
2. It ships a manifest + service worker (`sw.js`) — fine for an internal PWA,
   but that also makes it sticky in any browser that ever visits it.

### Delivered keepsakes (`keepsakes/` repo)

**Good:** The examined page (`she-left-us-a-party/index.html`) is on-brand
(Cormorant/Lato, site rose palette), `noindex, nofollow, noarchive` (line 6),
`strict-origin-when-cross-origin` referrer, thoughtful OG alt text, print
styles that hide the CTA, first-name-only dedication. This is what delivery
should look like visually.

Issues:

1. **Missing required deliverables.** No MP3 download, no lyric-sheet PDF —
   `grep` finds no `download=` attribute and no downloads section, while
   `KEEPSAKE-OPERATIONS.md` (lines 9–17) requires both and the homepage pricing
   card promises "MP3 download to keep forever" and "Lyric sheet to download."
   The album art is also a click-out to YouTube rather than in-page playback.
2. **CTA regression:** line 424 — "Start a song" → `tinyurl.com/heartstringswv`
   (homepage). The July fix pointed keepsake CTAs at `/storyroom/`; the fork of
   the builder now living in the `keepsakes` repo (its line 580) reverted to
   tinyurl, and delivered pages inherit it.
3. **Two builders, drifting.** `heartstringsstudio/keepsake-builder.html`
   (storyroom CTA, has DOCTYPE, noindex without `noarchive`) vs.
   `keepsakes/keepsake-builder.html` (tinyurl CTA, *missing `<!DOCTYPE html>`*,
   adds `noarchive`). `KEEPSAKE-OPERATIONS.md` declares the main-repo builder
   "the only supported keepsake template and generator," but production clearly
   happens from the fork. Pick one, delete the other, update the ops doc.
4. **"Only people you share the link with will find it" is not quite true.**
   The `keepsakes` repo is public: anyone can browse
   `github.com/heartstringsstudio/keepsakes` and enumerate every client page
   slug and its full content, forever, in git history. The ops doc itself says
   to keep real client keepsakes out of a public repo and to use access-controlled
   hosting when privacy is promised (lines 27–28) — the separate repo satisfies
   the "out of the marketing repo" half but not the access-control half.
5. **Page weight:** the single HTML file is ~460KB (base64-embedded art) plus a
   234KB `cover.jpg` — and the builder will happily inline an MP3 and PDF as
   data URIs, which would push a grieving family's phone load into multiple MB.
   No GA either, so keepsake-driven referrals are invisible.

### Orphans in the main repo

- **`sheleftusaparty.html`** — still contains `YOUTUBE_ID` (line 329),
  `[the moment]` placeholder story text (352–353), and a broken image path
  `images/she-left-us-a-party.webp` (317; the directory doesn't exist). It is
  now also *superseded*: the finished version of the same song lives at
  `/keepsakes/she-left-us-a-party/`. It's noindexed, but it's dead weight and a
  confusion risk. (Its footer CTA does correctly link `/storyroom/` — line 376.)
- **`banner.png` (1.6MB) and `timphoto.jpg` (36KB)** — referenced by nothing.
- **`AUDIT.md`** — useful history; consider moving punch-list state into issues.

---

## Findings by category

Tags: **[QUICK WIN]** ≤ an hour · **[MEDIUM]** a focused day-ish · **[BIG LIFT]** multi-day.

### 1. First impression (mobile, 5 seconds)

- **[QUICK WIN] Put "$150 flat · 48–72 hours" in the hero**, e.g. as the
  `hero-sub` line or under the primary CTA (index.html:2033–2041). *Why: the
  offer and next step are clear above the fold; the price — a differentiator at
  $150 — is three screens away.*
- **[QUICK WIN] Add the memorial reassurance near the top for that audience** —
  one line in the proof banner or trust strip: "Memorial songs delivered within
  24 hours, at no extra cost." *Why: the most emotionally urgent visitors get
  zero turnaround reassurance above the fold, and guardrails want 24-hour
  language living next to memorial copy.*
- What already works: the wordmark + "Your Story Deserves a Song" + Lumberport
  eyebrow reads as a real local studio, instantly. Keep it.

### 2. Visual design

- **[MEDIUM] Reconcile the two brand systems** (web rose `#c0455a` /
  Cormorant+Lato vs. print crimson `#9c1c30` / Playfair+Lora as seen in the
  quiz and the OG banner). Decide which is canonical, publish a tiny token file,
  and align the satellites. *Why: quiz → site currently feels like changing
  companies at the moment of interest.*
- **[QUICK WIN] Raise the keepsake-mock micro type** (index.html:1064 8.5px,
  1131 8px) to ≥10px or mark all of it `aria-hidden`. *Why: illegible on
  phones, and it's showcasing the flagship deliverable.*
- **[QUICK WIN] Reduce ornament dividers from 8 to ~3** (the big transitions).
  *Why: July's advice, still true — adjacent background changes already do the
  separating; the page is ~11k px tall.*
- Overall: the homepage does *not* feel like a template — the corner-bracket
  buttons, ornament system, and keepsake mock are distinctive and consistent.

### 3. Mobile experience

- **[QUICK WIN] Carousel dots are 8×8px tap targets** with no padding
  (index.html:1484–1489). Give them a ≥24px hit area (padding + background-clip).
  *Why: WCAG target-size and thumb reality; arrows partially compensate but the
  dots are the visible affordance.*
- **[QUICK WIN] Occasion pills at ≤500px are ~31px tall** (index.html:852) and
  the nav CTA at ≤480px ~32px (1937). Nudge padding toward 44px height. *Why:
  these are the highest-intent taps on the page.*
- **[MEDIUM] Adopt the Jukebox's thumbnail-facade pattern for the homepage's 6
  YouTube embeds.* *Why: mobile load on cellular; the pattern already exists
  in-house.*
- No horizontal overflow found at 390px in source review; the July `overflow:
  clip` + label-dash fixes are still in place (index.html:300–305, 1790).

### 4. Navigation and structure

- **[QUICK WIN] Rename nav/section "Investment" → "Pricing"** (index.html:2017,
  2319). *Why: plainspoken audience; "Investment" is the one word on the page
  that sounds like marketing.*
- **[MEDIUM] Decide the quiz's place**: link it from the homepage (occasions
  section is the natural home) or retire it. *Why: it's currently an orphan
  with its own brand and a weaker CTA.*
- **[QUICK WIN] Delete or finish `sheleftusaparty.html`** and remove
  `banner.png`/`timphoto.jpg`. *Why: an unfinished, superseded client memorial
  page is the worst possible thing to have accidentally shared.*
- **[QUICK WIN] Add a branded `404.html`** to the main repo (Pages picks it up
  automatically) with links to home / Story Room / Jukebox. *Why: mistyped
  keepsake links from Facebook comments land on GitHub's default 404 today.*
- **[MEDIUM] Missing page: a memorial/funeral landing page.** Memorials are the
  core segment, the free-24h promise is unique, and a `Funeral-Home` repo
  already exists for white-labeling — but the public site has no
  memorial-specific page to send that traffic to. *Why: ad/search traffic for
  "memorial song" currently lands on a general-occasion homepage.*

### 5. Copy

- **[QUICK WIN] State the memorial rush exception wherever rush is priced**:
  pricing note (index.html:2340) and FAQ #2 (2440) → "…additional $50
  *(memorial songs are always rushed free — delivered within 24 hours)*." *Why:
  current copy actively contradicts the real policy for the most sensitive
  buyers.*
- **[QUICK WIN] Fix the quiz's offer copy** ("printed lyric sheet" → the actual
  deliverables; mention the keepsake page). *Why: it's making a promise
  fulfillment doesn't match.*
- **[QUICK WIN] Jukebox filter "Other" → "Holidays".** *Why: it's hiding
  sellable seasonal work behind a shrug.*
- Tone check: no AI framing anywhere client-facing ✓; no guitars in copy or
  imagery (banner/logo/hero verified visually) ✓; the Story Room is the voice
  benchmark — dry, warm, Appalachian ("Somebody knew something."). The homepage
  is close; "Fresh from the studio — just dropped" is the only line that drifts
  toward social-media patter.
- Every CTA is single-action ✓ — the one exception is the quiz (see 6).

### 6. Conversion path

Traced (Facebook mobile, memorial):
tap ad → tinyurl redirect → homepage → CTA tap → Story Room → Begin → occasion
→ 9 question screens → contact → review → Send. **~14 taps, price revealed at
tap 2 (homepage) or tap 14 (direct Story Room arrivals).** The one-question-per-
screen pace is a deliberate, defensible choice for this audience — the issues
are all wiring:

- **[QUICK WIN] Make the Story Room read `?occasion=`** (storyroom/app.js — no
  URL parsing exists) and add a pill-label → occasion-key map. *Why: nine
  homepage pills and CLAUDE.md's documented behavior currently do nothing; a
  memorial clicker re-answers a question they already answered.*
- **[QUICK WIN] Point the Jukebox header CTA and the keepsakes-builder footer
  CTA at `/storyroom/`** (jukebox/index.html header; keepsakes/
  keepsake-builder.html:580; regenerate or hand-patch delivered pages'
  line 424). *Why: two of the three warmest audiences (listeners, keepsake
  recipients) are currently routed to the top of the homepage instead of the
  form.*
- **[QUICK WIN] Quiz CTA → Story Room** (keep mailto as a secondary "or just
  email us"). *Why: mailto is the highest-friction CTA on any property.*
- **[QUICK WIN] Show the price on the Story Room welcome screen.** *Why:
  direct arrivals currently learn it after 10 screens of emotional labor.*
- **[MEDIUM] Add GA4 to the Story Room (page_view + a `story_sent` event on the
  done screen), Jukebox, quiz, and keepsake template.** *Why: today the funnel
  is measurable only to the first click; completion rate, drop-off question,
  and keepsake-referral value are all guesses.*
- **[QUICK WIN] Replace every `tinyurl.com/heartstringswv` on owned pages with
  the direct URL** (storyroom noscript/footer/done screen, jukebox CTA, quiz
  footer, keepsakes builder + delivered pages). Keep tinyurl for print/social
  where a short URL earns its keep. *Why: an alias you don't control is a
  single point of failure sitting inside your conversion path.*

### 7. Trust signals

- Strong and well-presented: 107 songs / 48–72h / 5-star proof banner, Tim's
  face directly beneath it, WBOY embed with caption, four named testimonials in
  an accessible carousel, remake guarantee under the price, matching JSON-LD.
- **[QUICK WIN] Sitemap `lastmod` is stale (2026-07-01)** and the Product
  schema's `priceValidUntil` is 2026-12-31 — set a reminder or drop the field.
  *Why: cheap credibility hygiene with Google.*
- **[MEDIUM] The keepsake promise vs. delivery gap** (no MP3/lyric downloads on
  the shipped page) is a trust issue, not just an ops issue — the pricing card
  is the contract. *Why: one disappointed family screenshot outweighs a page of
  five-star copy.*
- Note: `aggregateRating` (reviewCount 4) on your own Product markup is the
  kind of self-serving review markup Google increasingly ignores or flags.
  Low priority; know it's there.

### 8. Accessibility

- Genuinely good across properties: reduced-motion everywhere on the public
  pages, no-JS FAQ fallback, carousel with roles/arrow keys/pause-on-focus,
  Story Room focus management, quiz radiogroup with roving tabindex,
  `focus-visible` styles throughout.
- **[QUICK WIN] Homepage song titles are `<div class="song-card-title">`**
  (2186, 2198, 2206, 2214) — make them `<h3>`s. *Why: heading-nav users skip
  from "Listen to what's possible" straight past all four songs.*
- **[QUICK WIN] Tap-target sizes** — see Mobile (§3).
- **[QUICK WIN] Keepsake-mock micro-type** — see Visual (§2); also add
  `aria-hidden` to the parts that are pure decoration but currently exposed
  (`.keepsake-brand-type`).
- Contrast spot-checks pass AA post-July fixes (proof labels ≈5.2:1, muted text
  on cream ≈4.8:1; quiz documents its own 6.77:1 floor).

### 9. Performance and hygiene

- **[QUICK WIN] Delete unused `banner.png` (1.6MB) and `timphoto.jpg`.** *Why:
  repo weight and clone time; zero site impact.*
- **[QUICK WIN] Trim the Google Fonts request** (index.html:255) to the weights
  actually used (roughly: Cormorant 500/600 + italics, Lato 400/700, Playfair
  600 italic). *Why: fonts are the largest render-blocking cost on first paint.*
- **[MEDIUM] YouTube facades on the homepage** — see §3.
- **[MEDIUM] Keepsake page weight** (~460KB HTML + 234KB cover; MP3/PDF would
  inline as base64) — host media as real files in each keepsake folder instead
  of data URIs. *Why: grieving families on phones; also lets the MP3 be
  range-requested/streamed.*
- **[QUICK WIN] Jukebox: add `og:image`; Story Room: add OG tags + favicon.**
  *Why: both get shared on Facebook, where the grey-box preview costs clicks.*
- `robots.txt` remains correctly annotated as inert; in-page noindex tags are
  the real mechanism and are present everywhere they should be — **except the
  Sorting Porch [QUICK WIN]: add `<meta name="robots" content="noindex,
  nofollow">`.** *Why: it's the one internal, AI-mentioning tool a search
  engine is currently allowed to index.*
- 404 handling: none on any property — see §4.

### 10. Consistency across satellites

- **Jukebox:** exemplary — shares tokens, fonts, ornaments with the main site.
- **Delivered keepsakes:** visually on-brand; wiring off-brand (tinyurl CTA,
  missing downloads).
- **Story Room:** same family, softer dialect (Nunito Sans, `#b34760`, rounded
  radii) — acceptable if deliberate, worth one pass to share the exact rose/
  cream hex values.
- **Song quiz:** a different brand entirely (crimson/blush, Playfair+Lora,
  redrawn logo) — the biggest visual outlier, and also the biggest CTA outlier.
- **Sorting Porch:** parchment/oxblood, system fonts — fine for an internal
  tool; the problem is indexability, not styling.
- **[MEDIUM] One shared "brand.css" (or even a documented token list) applied
  to Story Room + quiz** would close 80% of the gap. *Why: the seams show at
  exactly the moments of highest intent (quiz result, form entry).*

---

## Three redesign paths

### A — Polish in place (recommended)

Keep every page and layout as-is; fix the wiring and the promises. Concretely:
the Story Room `?occasion=` param + pill mapping; all CTAs off tinyurl and onto
`/storyroom/` (jukebox, quiz, keepsakes builder + delivered pages); GA4 on all
four public satellites with a `story_sent` completion event; memorial free-rush
language on the homepage pricing/FAQ; price in the hero and on the Story Room
welcome; Sorting Porch noindex; kill the duplicate builder and restore
MP3/lyric downloads to keepsake output; 404 page; delete orphans; font/facade
trims; tap-target and heading fixes. **Effort: roughly 2–4 focused days spread
across six repos.** Changes: conversion wiring, measurement, honesty of
promises. Doesn't change: visual design, page structure, the quiz's separate
brand, keepsake hosting privacy model.

### B — Partial restructure

Everything in A, plus: a shared brand-token stylesheet adopted by Story Room
and a re-skinned quiz; a dedicated memorial landing page (the free-24h promise,
memorial samples, straight into the memorial Story Room track) that ads and the
funeral-home partnership can target; homepage tightened by ~a third (merge
Difference into the hero-adjacent copy, cut dividers to three, move WBOY lower);
keepsake operations consolidated into the `keepsakes` repo with one builder,
real media files, and the required-deliverables checklist enforced by its
existing tests. **Effort: 1–2 weeks.** Changes: information architecture at the
edges, satellite cohesion, memorial acquisition. Doesn't change: the core
homepage design language, hosting model, or the Story Room flow.

### C — Full redesign

One repo (or one build) behind a custom domain (`heartstringsstudio.com`),
unified design system across home/intake/jukebox/quiz/keepsakes, keepsakes
moved to access-controlled hosting so "private" can be promised truthfully,
homepage rebuilt mobile-first around the memorial and wedding segments, weekly-
song publishing automated from `songs.json`. **Effort: several weeks plus
domain/hosting cost and link-equity migration (every printed tinyurl, QR code,
and Facebook post re-pointed).** Changes: everything. Doesn't change: the offer
itself — and that's the problem; nothing in this audit suggests the *design* is
what's limiting conversion.

**Recommendation: Path A.** Every high-value loss found in this audit is a
broken seam — a parameter never read, a CTA pointing one page short, a metric
never installed — and Path A repairs all of them for days of work, while B and C
mostly reshuffle pages that already do their jobs.

---

## Open questions for the owner

1. **How does payment actually happen?** No page mentions or collects it; the
   Story Room ends at "we'll contact you." If that's deliberate (invoice after
   lyric approval?), one sentence saying so on the review screen would prevent
   drop-off from uncertainty.
2. **Is the free 24-hour memorial rush still policy?** The site's pricing copy
   ($50 rush, no exception) and the Story Room's promise (always free for
   memorials) currently disagree — which one should the copy match?
3. **Which keepsake builder is canonical** — the main repo's or the `keepsakes`
   repo's fork — and were the missing MP3/lyric downloads on
   `she-left-us-a-party` a one-off omission or the new normal?
4. **What should the tinyurl aliases point to long-term**, and who holds the
   tinyurl account? (`heartstringswv` → homepage and `hsjukebox` → jukebox are
   load-bearing in print/social; on-site links shouldn't depend on them.)
5. **Is the song quiz meant to funnel to email on purpose** (a softer ask), or
   should it feed the Story Room like everything else?
6. **Is a custom domain on the roadmap?** Several fixes (OG URLs, canonical
   tags, keepsake privacy posture) are worth doing differently if
   `heartstringsstudio.com` is coming in the next few months.
7. **May the delivered keepsake pages stay in a public GitHub repo?** Current
   pages are noindexed but publicly enumerable via the repo listing — fine if
   clients are told "unlisted," not fine if anyone was told "private."
8. **GA4:** should the satellites share property `G-TB4NQVQ8VZ` or get their
   own? (Sharing it with page-path filtering is the simple answer.)
