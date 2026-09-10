# Heartstrings Studio — project notes

## Editing `index.html`

- **Do not use the "upload index.html" path in the GitHub web UI.** It replaces
  the whole file with whatever local copy is picked. This has now cost the site
  twice: commit `7b1e359` reverted all the `/intake/` links and restored the old
  inline order form, and the September 2026 rebuild (`3f95ba3`, `c7697c8`,
  pushed straight to `main`) dropped the entire `<head>` — Google Analytics, all
  Open Graph/Twitter/canonical tags, and the JSON-LD structured data went with
  it and had to be rebuilt by hand. Make changes via commits/PRs that build on
  the current file instead.
- Run `npm test` before pushing. The suite covers the keepsake builder and, in
  `tests/seo.test.mjs`, the site's structured data, analytics wiring, and the
  Story Room CTA rules below.
- **Bump the `?v=` on the `style.css` link whenever you change `style.css`.**
  The tag reads `<link rel="stylesheet" href="style.css?v=4-eyebrow">`; returning
  visitors cache that exact URL, so a CSS-only change under an unchanged query
  string never reaches them — not even on a hard refresh, since phone browsers
  reload the HTML but reuse cached subresources. This bit the mobile hero
  eyebrow fix (`#113`), which looked broken on the live site until `#114` bumped
  the number. Use a short descriptive suffix, e.g. `?v=5-pricing`.

## How the page is put together

The site was rebuilt from scratch in September 2026 and no longer resembles the
older single-file version:

- `index.html` — minified markup, roughly one section per line. Head is expanded
  and readable; leave it that way.
- `style.css` — the warm walnut/amber system (`--bg:#271c16`, `--accent:#f0b86f`),
  DM Sans body + Libre Caslon Display headings. The earlier "Candlelight"
  palette, Cormorant Garamond and Mulish are all gone. Note there are **two**
  `@media (max-width:760px)` blocks; the appended one at the bottom of the file
  wins, so put phone fixes there.
- `script.js` — holds the page's content as arrays and renders it at load:
  `occasions`, `songs`, `faq`. It also carries the scroll/reveal motion, the
  song-card player, and the GA event tracking.
- `assets/` — `studio.webp` (hero), `porch.webp`, `wedding.webp`, `tim.jpeg`,
  `logo.png`. The root `logo.png` and `favicon.png` are still used by
  `404.html` and `keepsake-builder.html`, so don't delete them. `banner.jpeg` is
  kept as the JPEG fallback share image. `timphoto-new.jpeg` and
  `timphoto-avatar.jpg` are unused.

## Song playback

- Song cards play **in place**, using the Jukebox's player pattern: the artwork
  is a `<button>`, and the `youtube-nocookie.com` iframe is only built when
  someone presses play, so no embed cost is paid by people who never do. One
  song plays at a time; Escape or the Close button restores the card face.
  `buildFace` / `startSong` / `stopSong` in `script.js` are the whole mechanism
  — none of the cards link out to youtube.com any more.
- If the iframe hasn't loaded after 7 seconds (or the visitor is offline), the
  card swaps to a plain "Open on YouTube →" link. Keep that fallback: rural
  connections drop these embeds.
- The two WBOY "304 Today" links (the `AS SEEN ON` badge in the proof bar and
  the text link in Tim's section) open that segment in a lightbox running the
  same player. They stay real `youtube.com/watch` anchors and `script.js`
  upgrades any `a[data-video]` click into `openVideo()`, so scripts-off,
  ctrl-click and browsers without `<dialog>` still reach the video. The player
  itself is shared: `fillPlayer` builds the iframe (or the fallback) for both
  the cards and the lightbox, so a fix in one lands in both.
- Keepsake pages built by `keepsake-builder.html` do the same thing, but as a
  progressive enhancement — the cover stays an `<a>` to youtube.com so a
  scripts-off (or offline, or ctrl-clicking) client can still reach the song,
  and the inline script upgrades the click into an in-page player.

## Weekly song update

- The old `.weekly-song-embed` thumbnail facade is **gone**. There is no `data-yt`
  attribute and no three-places edit any more.
- To swap the week's song, edit the **first entry of the `songs` array in
  `script.js`** — `[videoId, sceneKeyword, label, title, description]`. The label
  on that first entry is what reads "This week's song"; the rest of the array is
  the standing showcase.
- `sceneKeyword` picks the backdrop behind the YouTube thumbnail: `wedding` and
  `kitchen` → `wedding.webp`, `teacher` → `studio.webp`, anything else →
  `porch.webp`.
- The Jukebox's `songs.json` spotlight should be updated in the same pass.

## Structured data and analytics

- The JSON-LD in the head duplicates content that `script.js` renders. **If you
  change the `faq` array or the testimonial blockquotes, update the JSON-LD in
  the same commit** — `tests/seo.test.mjs` fails when they drift apart.
- Review markup must describe only the testimonials actually visible on the page
  (currently three), and `aggregateRating.reviewCount` must match.
- GA4 tag is `G-TB4NQVQ8VZ`. The tracked events are `scroll_depth`,
  `section_view`, `cta_click`, `generate_lead`, and `song_play` (fired when a
  song card's — or the WBOY lightbox's — player opens). Because the Story Room is
  off-site, a click through to it is the closest conversion signal available —
  `generate_lead` carries the `occasion` from the deep link.
- Song and FAQ content is injected by JavaScript, so it isn't in the served
  HTML. The FAQ is covered by the FAQPage JSON-LD; keep that in mind before
  moving any more copy into `script.js`.
- `sitemap.xml` has to be submitted directly in Google Search Console — the
  project-site `robots.txt` is never read. Bump its `lastmod` on real changes.

## The satellite pages (404, keepsake builder, keepsake template)

`404.html`, `keepsake-builder.html` and `keepsaketemplate.html` were on the
retired rose/charcoal palette (`--rose:#c0455a`, Cormorant Garamond + Lato)
until September 2026. They now carry the same walnut/amber system as
`style.css`, the jukebox and the Story Room. The **light-ground** half of that
system — these pages sit on cream, not on the dark hero ground:

| Role | Value | Was |
|---|---|---|
| Page ground | `#f4e8d2` | `#faf6f2` |
| Card / inset surface | `#fffaf0`, `#faf1de` | `#fffdf9`, `#f4ede6` |
| Primary accent (walnut) | `#774826` | `#c0455a` |
| Deep accent | `#5a3419` | `#8b2a3a` |
| Accent on dark ground (amber) | `#f0b86f` | `#d4637a` |
| Bronze | `#a17c52` | `#b8956a` |
| Body ink / muted | `#3f3227`, `#7d6a55` | `#3a2e30`, `#7a6668` |
| Walnut ground (footer) | `#271c16`, `#1b120f` | `#1a1416`, `#110b0d` |

Two things that are easy to get wrong:

- **Libre Caslon Display ships one weight (400) and no italic.** Use it only for
  upright display headings. Everything italic — and any serif running text like
  the lyric sheet — uses **Georgia** (`--serif-alt`), which is exactly what the
  main site does for its `em` rule. Setting weight 500/600 on Libre Caslon
  renders a faux-bold smear.
- **Focus rings on these pages are walnut `#774826`, not amber.** Amber on cream
  is far too low-contrast to be a focus indicator; amber is only for focus on
  the dark ground.

### Keepsake occasion tiers

Generated keepsake pages retint themselves from the occasion, and the three
tiers carry different emotional weight — keep that spread if you touch them:

| Tier | `--rose` | `--rose-light` | `--rose-deep` |
|---|---|---|---|
| Memorial / celebration of life | `#7d6247` (most muted) | `#e8cfa6` | `#5e4936` |
| Default | `#774826` | `#f0b86f` | `#5a3419` |
| Wedding / anniversary | `#8a4f1f` (warmest) | `#f5c684` | `#5a3419` |

All three clear WCAG AA on the cream ground; the retired memorial rose did not
(3.91:1).

### The studio mark

The mark lives in four places in this repo and has to be swapped in all four
together: `assets/logo.png` (512, used by `index.html`), the root `logo.png`
(512, used by `404.html`), `favicon.png` (256, the apple-touch icon and the
builder's copy) and `keepsake-builder.html`'s `LOGO_DATA_URI`, which is
`favicon.png` base64'd and is baked into every page the builder generates. The
dashboard repo carries its own four.

- The master is the 1254px PNG in the studio's Drive, not any file in this
  repo — every shipped size is a downscale of it. Cut new sizes from the
  master rather than from `assets/logo.png`, which is already downscaled.
- The master carries chroma speckle from its original background cut-out and a
  haze of near-zero-alpha pixels across the canvas. Trim to the alpha ≥ 12
  bounding box before scaling; leave the speckle alone, since LANCZOS averages
  it out well above the largest size the site ships.
- Each file frames the mark at roughly 54% of its canvas. Keep that — the
  header, the 404 page and the keepsake pages all size the mark by its canvas,
  so a tighter or looser crop silently resizes it in three places.
- **Bump the `?v=` on every logo URL in the same commit.** `index.html`,
  `404.html` and `keepsaketemplate.html` all carry `logo.png?v=…` /
  `favicon.png?v=…`; returning visitors cache those exact URLs, so a swapped
  file under an unchanged query string never reaches them. Same rule as
  `style.css`.
- **`assets/tim.jpeg` is a fifth appearance of the mark, and it can't be
  swapped.** The Meet Tim portrait (September 2026) shows Tim wearing the
  branded shirt, so the mark is embroidered into the photograph. A re-cut that
  changes the mark's *shape* leaves the portrait showing the old one — that
  needs a new photo, not a new export, so treat it as a separate task and
  don't count it among the four files above. A pure resize or cleanup of the
  existing shape doesn't affect it.

## Memorial rush wording

- Memorial songs are **always delivered within 24 hours at no extra cost**.
  Any copy that prices the $50 rush must state this exception — never imply
  memorial families pay for speed.

## Story room (client intake)

- The client story/commission page lives at
  `https://heartstringsstudio.github.io/storyroom/` and is served from a
  **separate source** — it is not in this repo. (It replaced the earlier
  `/intake/` form as of July 2026.)
- **Every** main-site CTA must link to `/storyroom/` — this includes all wording
  variants such as "Tell me your story", "Let's make your song", "Tell Tim your
  story", and the header button. None of them should point to an inline/on-page
  form.
- The occasion pills also link to `/storyroom/` and deep-link with `?occasion=...`
  (built from the `base` constant in `script.js`).
- There is **no inline order form** on the page (it was removed). Clicks through
  to `/storyroom/` are tracked in GA via `cta_click` / `generate_lead` events.
