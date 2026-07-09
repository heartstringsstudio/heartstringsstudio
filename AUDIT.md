# Heartstrings Studio — Full Site Audit (July 9, 2026)

*Covers first impressions, ease of use, functionality, flow, and security.
Audited from this repo's source, rendered locally in Chromium at 1440px and
390px. Supersedes the earlier appearance-only audit (see git history for it).*

**Scope notes:** The story room (`/storyroom/`) and jukebox (`/jukebox/`) are
served from separate repos and could not be fetched from the audit environment
(network policy). Every conversion path on this site hands off to them, so
they're audited up to the click. No GitHub secrets, API keys, or credentials
were found anywhere in the repo.

---

## 1. What's good

**The conversion path is genuinely strong — and now rule-clean.**
15 links to `/storyroom/` and 4 to `/jukebox/`, consistently worded, all
GA-tracked (`cta_click` / `generate_lead`). Zero references to the old
`/intake/` form and no inline form — the CLAUDE.md brand rules are fully
honored. Occasion pills deep-link with `?occasion=…` so the form arrives
pre-filled. A motivated visitor reaches the form in one click from any scroll
position.

**The trust arc got fixed since the last audit.** Tim's face now appears in a
trust strip directly under the proof banner ("Every song is written personally
by Tim Harbert…"), the stat wall was cut to three stats led by "107 songs
delivered," the 20,000-views number was folded into the proof quote as
resonance rather than reach, the remake guarantee sits right under the pricing
CTA, the duplicate "What's Included" section is gone, and the hero banner
image was replaced with a proper logo lockup. That was the top of the last
punch list — all done.

**Craft quality is high for a hand-built static site.**
- Thorough `prefers-reduced-motion` support (animations, counters, carousel all respect it).
- Progressive enhancement: FAQ renders fully open without JS; the accordion is a JS upgrade.
- Real accessibility work: aria labels/roles on nav, carousel, and accordion; `focus-visible` styles; honest alt text; carousel pauses on hover/focus and supports arrow keys.
- Rich, consistent structured data (Business, WebSite, Product, FAQ) that matches the visible page — the FAQ schema mirrors the on-page FAQ exactly, as Google requires.
- The keepsake builder escapes all user input (`escHtml`/`escAttr`) before generating pages.
- No horizontal overflow at 390px or 1440px (the earlier mobile wiggle is fixed), hamburger menu and FAQ accordion verified working.

**Tiny attack surface.** Static site, HTTPS enforced by GitHub Pages, no
forms, no cookies of its own, no secrets in the repo, no third parties beyond
Google Fonts, GA, and YouTube.

---

## 2. What's broken (functionality)

### 2.1 Nav anchor links bury section headings under the sticky nav — *quick fix*
Verified in-browser: clicking **Listen, Process, Pricing, or FAQ** in the nav
(or "Hear this week's song ↓" in the hero) scrolls the section to 20px from
the viewport top, but the fixed nav is 60px tall — the top **40px of every
target section lands hidden underneath the nav bar**. Cause:
`html { scroll-padding-top: 20px }` doesn't account for the nav.
**Fix:** `scroll-padding-top: 80px` (nav height + breathing room). One line.

### 2.2 Self-referencing absolute image URLs — *quick fix*
The hero logo, trust-strip avatar, Tim's bio photo, and footer icon are all
hard-coded as `https://heartstringsstudio.github.io/heartstringsstudio/…`.
Works in production, but it breaks any local preview, any fork/staging
deploy, and a future custom-domain move.
**Fix:** relative paths (`logo.png`, `timphoto-avatar.jpg`, …). Keep absolute
URLs only where required (og: tags, JSON-LD).

### 2.3 `robots.txt` is decorative — it never gets read — *know this*
Crawlers only fetch robots.txt at the **domain root**
(`heartstringsstudio.github.io/robots.txt`), which this project-page repo
can't serve. The `Disallow: /keepsake-builder.html` lines therefore do
nothing (and the paths are missing the `/heartstringsstudio/` prefix anyway).
Nothing is exposed — the in-page `<meta name="robots" content="noindex">`
tags on both studio tools are the effective protection, and they're correct.
**Fix:** none urgent; either delete robots.txt or keep it knowing it's inert.
Never rely on it for hiding pages. (Sitemap: submit it directly in Search
Console; robots.txt discovery won't happen.)

### 2.4 `sheleftusaparty.html` is unfinished and half-broken — *finish or remove*
Still contains the `YOUTUBE_ID` placeholder, `[the moment]` bracket text, an
album-art reference to `images/she-left-us-a-party.webp` (the `images/`
directory doesn't exist — broken image), and a footer CTA that routes through
`tinyurl.com/heartstringswv` instead of linking `/storyroom/` directly. It's
noindexed so search won't find it, but **don't share the URL** until it's
filled in — and update the builder/template so future keepsakes link the
story room directly (see §4.4 on tinyurl).

### 2.5 The whole funnel depends on two pages this audit can't see — *verify manually*
Every CTA on the site terminates at `/storyroom/` or `/jukebox/`. If either
ever 404s or the story room stops reading `?occasion=`, the site converts
nothing and no error will surface here. Worth a monthly two-minute click-through:
storyroom loads, occasion pre-fills, visual style doesn't feel like a
different company at the moment of highest commitment.

---

## 3. Ease of use & flow

**Flow order is right.** Hero → proof → trust → weekly song → difference →
press → early CTA → occasions → listen → process → pricing (with guarantee) →
testimonials → bio → FAQ → close. Objections are answered roughly in the
order a first-time buyer forms them. Pricing states the price early (start
strip) instead of hiding it. FAQ sits just before the final ask. Good.

Remaining friction, ranked:

### 3.1 Low-contrast fine print — *quick fix*
The lines older memorial-audience visitors most need to read are the faintest
on the page, all at 11–12.5px: `hero-sub` (42% opacity), `price-note` with the
email address (38%), `footer-copy` (24%). The pricing-note was already raised
to 70% — do the same for these (≥70%).

### 3.2 `javascript:void(0)` links in the footer and close — *quick fix*
Facebook, TikTok, and both Email links are `href="javascript:void(0)"` with
inline `onclick`. Consequences: middle-click / "open in new tab" does nothing,
they're dead with JS off, and `window.open()` without `noopener` hands the
opened site a `window.opener` reference (tabnabbing-class nit — destinations
are trusted, but it's free to fix). The email obfuscation buys nothing:
the address sits in **plaintext** in the JSON-LD (`"email":
"heartstringsstudiowv@gmail.com"`), so scrapers already have it.
**Fix:** plain anchors —
`<a href="https://…" target="_blank" rel="noopener noreferrer">` and
`<a href="mailto:heartstringsstudiowv@gmail.com">`.

### 3.3 FAQ says "fill out the intake form" but never links it — *quick fix*
FAQ answer #1 (and #2's "mention your date on the intake form") name-drop an
intake form that isn't on this page, with no link. A reader deep in the FAQ
shouldn't have to hunt. **Fix:** link the phrase to `/storyroom/` in both
answers (keep the JSON-LD text as plain text).

### 3.4 Page length
~11,200px tall at desktop — better than before, still a long scroll with 8
ornamental dividers. The earlier advice stands: keep dividers at the three big
transitions and let adjacent background changes do the separating elsewhere.
Not urgent; the early start-strip CTA already de-risks the length.

### 3.5 Dead CSS — *housekeeping*
~110 lines of styles for the removed inline form (`.form-section`,
`.form-row`, `.form-status`, etc.) plus a `.delivers` rule with no matching
markup. Harmless, but it invites the exact "which form wiring is live?"
confusion CLAUDE.md warns about. Delete.

---

## 4. Security & privacy

No exploitable vulnerabilities found: no forms, no secrets, escaped output in
the builder, HTTPS everywhere. The real findings are policy-level:

### 4.1 "Private keepsake page" is a promise the hosting can't keep — *decide deliberately*
This repo is **public** (GitHub Pages requires it on the free tier). Anything
committed here — including client keepsake pages like `sheleftusaparty.html` —
is browsable in the GitHub file listing and permanent in git history, even if
the URL is never shared and the page is noindexed. The homepage repeatedly
promises a "**private** keepsake page" and "**private** YouTube link." For a
grieving client sharing intimate memories and full names, "private" implies
access control; what's actually delivered is *unlisted/obscure*. Options, in
increasing effort:
1. **Wording fix (cheap, honest):** "your own personal keepsake page — unlisted, only people you share the link with will see it."
2. **Data minimization:** first names only on keepsake pages; get explicit consent for the story text before publishing.
3. **Real privacy:** host keepsakes somewhere with access control (e.g., a paid host, or password-protected pages) if the promise should stay "private."
At minimum keep `noindex` on every generated keepsake (the builder/template already do this — verify each published page keeps it).

### 4.2 The story room holds the sensitive data — audit it there
Client stories, names, emails, and occasion details flow through
`/storyroom/`, which lives outside this repo. Wherever that form posts
(Formspree, Google Forms, etc.) is the single most sensitive point in the
whole operation. Worth confirming: submissions go over HTTPS, land only in
accounts Tim controls, and aren't retained by a third party longer than needed.

### 4.3 Keepsake builder is publicly reachable — *acceptable, but know it*
`/keepsake-builder.html` is client-side only, contains no secrets, and is
noindexed — but anyone who guesses the URL can use the studio's page generator
to produce official-looking Heartstrings keepsake pages. Low risk; if it ever
grows real studio data, move it off the deployed site entirely.

### 4.4 `tinyurl.com/heartstringswv` on keepsake CTAs — *replace*
You don't control tinyurl. If the alias ever expires or is claimed to point
elsewhere, every delivered keepsake's CTA silently hijacks. Link
`/storyroom/` directly in the template and builder output.

### 4.5 Analytics & embeds — *minor*
GA4 runs with no consent notice — fine for a US/WV audience today; revisit if
marketing ever targets EU/UK visitors. Optionally switch YouTube embeds to
`youtube-nocookie.com` to cut tracking cookies for visitors who never press
play. A `Content-Security-Policy` meta tag would be belt-and-suspenders for a
site with no inputs; nice-to-have, not needed.

---

## 5. Prioritized punch list

**Do now (each ≤15 minutes):**
1. `scroll-padding-top: 20px` → `80px` — fixes every nav link (§2.1)
2. Real `href`s + `rel="noopener noreferrer"` for Facebook/TikTok/Email links (§3.2)
3. Link "intake form" → `/storyroom/` inside FAQ answers 1–2 (§3.3)
4. Raise `hero-sub` / `price-note` / `footer-copy` opacity to ≥0.7 (§3.1)
5. Make image srcs relative (§2.2); delete dead form CSS (§3.5)

**Do this month:**
6. Decide the keepsake privacy posture and align the "private" wording (§4.1)
7. Replace tinyurl with a direct storyroom link in template + builder (§4.4)
8. Finish or park `sheleftusaparty.html`; create `images/` or fix the art path (§2.4)
9. Manual click-through of storyroom + jukebox, including `?occasion=` pre-fill (§2.5)
10. Delete or annotate the inert robots.txt; submit sitemap via Search Console (§2.3)

**Leave alone:** the testimonial carousel, the pricing card, the trust strip,
the structured data, and the reduced-motion/accessibility work. They're the
best things on the site.
