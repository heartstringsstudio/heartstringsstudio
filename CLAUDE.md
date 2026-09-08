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
  `occasions`, `songs`, `faq`. It also carries the scroll/reveal motion and the
  GA event tracking.
- `assets/` — `studio.webp` (hero), `porch.webp`, `wedding.webp`, `tim.jpeg`,
  `logo.png`. The root `logo.png` and `favicon.png` are still used by
  `404.html` and `keepsake-builder.html`, so don't delete them. `banner.jpeg` is
  kept as the JPEG fallback share image. `timphoto-new.jpeg` and
  `timphoto-avatar.jpg` are unused.

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
  `section_view`, `cta_click`, and `generate_lead`. Because the Story Room is
  off-site, a click through to it is the closest conversion signal available —
  `generate_lead` carries the `occasion` from the deep link.
- Song and FAQ content is injected by JavaScript, so it isn't in the served
  HTML. The FAQ is covered by the FAQPage JSON-LD; keep that in mind before
  moving any more copy into `script.js`.
- `sitemap.xml` has to be submitted directly in Google Search Console — the
  project-site `robots.txt` is never read. Bump its `lastmod` on real changes.

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
