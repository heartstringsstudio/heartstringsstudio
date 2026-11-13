# Heartstrings Studio — project notes

## The site's address (changed 12 November 2026)

- **The site lives at `https://heartstringswv.com/`.** The owner bought the
  domain at Namecheap; its DNS has four A records to GitHub Pages and a
  `www` CNAME to `heartstringsstudio.github.io`.
- **Never delete the root `CNAME` file.** GitHub created it when the domain
  was set; without it the site drops back to the old address.
- The old address, `https://heartstringsstudio.github.io/heartstringsstudio/`,
  forwards to the new one page for page, so links already posted still work.
  Don't use it in new markup.
- **Keepsakes and the Jukebox did not move.** They are still under
  `https://heartstringsstudio.github.io/keepsakes/…` and `/jukebox/`.
  Delivered keepsakes hardcode those addresses, and the old studio address
  for their banner and link home; the forwarding is what keeps them working.
- Every absolute address in `index.html`, `memorial/index.html`, `404.html`,
  `sitemap.xml`, `robots.txt`, the keepsake builder and the tests uses the
  new domain.

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
  commission CTA rules below.
- **Bump the `?v=` on the `style.css` link whenever you change `style.css`.**
  The tag reads `<link rel="stylesheet" href="style.css?v=35-memorial">`; returning
  visitors cache that exact URL, so a CSS-only change under an unchanged query
  string never reaches them — not even on a hard refresh, since phone browsers
  reload the HTML but reuse cached subresources. This bit the mobile hero
  eyebrow fix (`#113`), which looked broken on the live site until `#114` bumped
  the number. Use a short descriptive suffix, e.g. `?v=5-pricing`.
  **`memorial/index.html` loads the same stylesheet and must carry the same
  `?v=`**; `tests/memorial.test.mjs` fails if the two differ. Bump
  `script.js?v=` the same way whenever `script.js` changes.

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
- **Colour tokens** live in `:root` at the top of `style.css`. Use the name,
  not the hex, for any colour that already has one; add a token only when a
  new colour is used in more than one place with the same role.

  | Token | Value | Role |
  |---|---|---|
  | `--bg` / `--panel` | `#271c16` / `#382920` | Dark ground, raised panel |
  | `--ink` / `--muted` / `--ink-soft` | `#fff1dc` / `#d6bfa6` / `#efd6b5` | Text on the dark ground |
  | `--accent` / `--accent-glow` | `#f0b86f` / `#f0b86f99` | Amber accent and its glow |
  | `--line` | `#e3b78640` | Rules on the dark ground |
  | `--button` / `--button-edge` | `#edb268` / `#956536` | Amber button and its 3D edge |
  | `--walnut` / `--walnut-edge` | `#774826` / `#4a2e17` | Walnut button on cream (price card) |
  | `--cream-ink` / `--cream-muted` / `--cream-accent` | `#382719` / `#746149` / `#96602d` | Text, secondary text and accent/focus on cream |
  | `--card` / `--card-edge` | `#fff3dc` / `#baa27d` | Song card face and offset shadow |
  | `--price-edge` | `#b48c5f` | Price card offset shadow |
  | `--pill-line` / `--cream-line` | `#ac805655` / `#795b3544` | Occasion pill border, rules on cream |
- `script.js` — holds the page's content as arrays and renders it at load:
  `songs`, `faq`. It also carries the scroll/reveal motion, the
  song-card player, and the GA event tracking.
- `assets/` — `tim-hero.webp` (hero portrait), `studio.webp`, `porch.webp`,
  `wedding.webp`, `tim.jpeg` (the source of the hero cut),
  `logo.png`. The root `logo.png` and `favicon.png` are still used by
  `404.html` and `keepsake-builder.html`, so don't delete them. The header
  mark on this page is `favicon.png` too (256px, a third the weight of the
  512px `assets/logo.png`, which now only serves as the tab icon).
  `assets/share-card.jpg` is the 1200×630 JPEG fallback share image for
  scrapers that won't read the WebP. `banner.jpeg` no longer serves this page
  at all, but **don't delete it and don't resize it** — it is still the
  keepsake builder's no-art-yet fallback, `tests/keepsake-builder.test.mjs`
  asserts it by name, and keepsake pages already sent to clients hardcode both
  that URL and its 1920×600 dimensions. Redraw it in place instead; that is
  what carried the current mark onto keepsakes that shipped months ago.
  `timphoto-new.jpeg` and
  `timphoto-avatar.jpg` are unused.

## Page order (November 2026: 14 phone screens down to under 9)

The audit found almost nobody reached the price, which sat nine phone
screens down. The page is now ordered for someone deciding in seconds on a
phone, and `tests/seo.test.mjs` pins the order:

1. Hero: the studio name as the headline, Tim's real portrait, price line,
   Message me, Book a callback, text/call, proof line
2. This week's song (`#weekly-song`)
3. Three more songs (`#listen`) plus the "N more songs" drawer
4. Memorial band (`#memorial`): the 24-hour promise and a Message me button
5. Reviews, all three visible
6. Porch statement (`#heart`): **desktop only**, hidden at 760px and below
7. How it works + price in one section (`#process`; the price card is
   `#pricing`). The price card is no longer tilted
8. Book a callback (`#callback`)
9. About (`#meet-tim`), FAQ (`#faq`, five questions), closing, footer

Things that were cut on purpose; don't add them back without the owner
asking: the Keepsake section (photo plus three tilted cards; its content is
the price card's list), the dark jukebox invite block (the jukebox is one
text link in the gallery head), the pricing column's own headline and its
"A little less to carry" memorial note (now the memorial band), and the FAQ
entries on gifting and one-of-a-kind. On phones the gallery cards drop their
descriptions and the About pull quote is hidden.

**The 24-hour figure appears in two places in the page body and no others:**
the memorial band (free, always) and the price card's rush add-on (paid,
with the memorial exception beside it). A test checks it.

Before adding a section, measure: the phone page is about 8.5 screens at
390 × 844. Anything new should replace something.

- **Gallery and drawer.** `featured` in `script.js` holds three YouTube ids,
  one each for memorial, wedding and tribute; those render as cards in
  `#songs`. Every other entry in `songs` (except the first, the weekly song)
  renders inside `<details class="all-songs">` in `#songs-more`, so the
  `ItemList` never describes a song that isn't on the page. If a featured
  song is removed from `songs`, or becomes the weekly song, it simply drops
  out of the three; pick a replacement id.

## The memorial page (`memorial/`, November 2026)

`https://heartstringswv.com/memorial/` is the
page to link from memorial posts: a grieving visitor lands on something that
speaks only to them. About 4.6 phone screens.

- **Files:** `memorial/index.html`, `memorial/memorial.css` (only what is the
  page's own; everything else comes from `../style.css`), and
  `memorial/memorial.js` (the in-place player and the contact tracking).
  `script.js` is not loaded there; it is tied to the home page's markup.
- **Order:** quiet type-only opening ("A song for someone you love and
  miss."), three songs, three steps, two reviews, the price, closing. Wide
  screens show the dusk porch beside the opening; phones do not load it.
- **Promise line:** "Ready in 24 hours · $150 flat · Never a rush fee". The
  page never prices rush and never mentions 48–72 hours; a test checks both.
- **Same commission path** as the home page: Message me, text/call under it,
  Book a callback as the outlined button. **No pinned bar** and no extra
  motion, on purpose: the page is short and the tone is quiet.
- **Songs** are three real `youtu.be` links (so they work with scripts off)
  that `memorial.js` upgrades to the in-place nocookie player. Each must also
  be in the home page's `songs` array; a test checks it. Pick memorial or
  celebration-of-life songs only.
- The home page's memorial band links here ("More about memorial songs →").
  The page is in `sitemap.xml`.
- Leads from it carry `placement` `memorial_hero`, `memorial_closing` or
  `memorial_page`.
- Its hours line ("I take calls every day, 8 to noon and 4 to 6 Eastern")
  has to change with the home page's when the owner's schedule changes.

## Type rules (November 2026)

- **Every upright heading is Libre Caslon Display**, including card titles
  (`.song h3`) and step titles (`.steps h3`), which used to be Georgia and
  looked like a failed font load beside the Caslon headings. Georgia is for
  italics and quotes only, because Caslon Display has no italic.
- **Nothing is set below 14px (`.875rem`).** The audience skews older and
  arrives on phones. That includes eyebrows, labels, captions and the footer
  line.

## Song playback

- Song cards play **in place**, using the Jukebox's player pattern: the artwork
  is a `<button>`, and the `youtube-nocookie.com` iframe is only built when
  someone presses play, so no embed cost is paid by people who never do. One
  song plays at a time; Escape or the Close button restores the card face.
  `buildFace` / `startSong` / `stopSong` in `script.js` are the whole mechanism
  — none of the cards link out to youtube.com any more.
- If the visitor is offline, show the plain "Open on YouTube →" fallback.
  If the iframe has not loaded after 7 seconds, add that link below it without
  removing the player: a usable YouTube player can appear before its load event.
  Remove the loading help when the frame finishes loading. Keep both fallbacks
  for rural connections.
- The two WBOY "304 Today" links (the `AS SEEN ON` badge in the proof bar and
  the text link in Tim's section) open that segment in a lightbox running the
  same player. They stay real `youtube.com/watch` anchors and `script.js`
  upgrades any `a[data-video]` click into `openVideo()`, so scripts-off,
  ctrl-click and browsers without `<dialog>` still reach the video. The player
  itself is shared: `fillPlayer` builds the iframe (or the fallback) for both
  the cards and the lightbox, so a fix in one lands in both.
- Keepsake pages built by `keepsake-builder.html` do **not** use the YouTube
  player: the client hears the song on the page itself. The page plays
  `song.mp3` from its own folder under the album art, with a **Download your
  song** button; YouTube is at most a small "Also on YouTube" link at the very
  bottom, never embedded. The MP4 share video is a required Google Drive
  link (a "Watch the video" button plus a download item), never a file in
  the page's folder. The builder's **Page type** switch builds a *First listen*
  page (art, song and lyrics only: no story, downloads, video, share or YouTube) or
  the *Keepsake delivery* page; both use the same folder and link. See
  `KEEPSAKE-OPERATIONS.md`.
- A keepsake's share card (`og:image` / `twitter:image`) is the page's own
  `art.jpg` at its public address. With no art chosen yet, the studio banner
  stands in.

## The hero (rebuilt November 2026)

- **The `h1` is the studio name**: "Heartstrings" upright, "Studio" in the
  inked italic with the swash under it (`<span class="ink">`). The old
  headline, "Who would you give a song to?", is the italic line under it
  (`.hero-question`). Before this the name was 14px tall in the header.
- **The picture is the real portrait**, `assets/tim-hero.webp` (a WebP cut
  of `assets/tim.jpeg`), not the illustrated `studio.webp` scene. Most
  visitors know Tim. On wide screens it holds the right 48% and fades into
  the ground; on phones it is a 300px band above the copy. If
  `tim.jpeg` is ever replaced, re-cut `tim-hero.webp` and bump its `?v=`.
  It is another appearance of the mark (the shirt), like `tim.jpeg` itself.
- **Phones have no header.** Its nav and button were already hidden there;
  the name is the headline now.
- **The postcard is gone**, and the About section no longer has a portrait
  (the hero introduces him). The scroll cue is the hero's one link to the
  weekly song.
- `studio.webp` is still used: second `og:image`, the JSON-LD `image`, and
  the `teacher` card backdrop. `studio-hero-mobile.webp` and
  `porch-postcard.webp` are no longer referenced by this page.
- No fireflies here: they belong to the dusk porch, not a studio portrait.

## Page flair

All of it stands down under `prefers-reduced-motion`, and none of it changes
what crawlers or scripts-off visitors get. **The owner asked for fewer
animations (November 2026). These were removed and should stay removed:**
the slow drift on phone images, the 3D tilt on hover, the travelling dot on
the steps, the count-up, and the rotating reviews. What is left:

- **Handwritten headline** — the hero's `<span class="ink">` wraps "Studio"
  and an SVG swash; CSS inks the word in and then draws the swash.
- **Fade-in on scroll** — `.reveal` blocks rise in once as they arrive.
- **Fireflies** — `script.js` builds `.fireflies` inside `.home-sticky` and only
  runs them while the porch is on screen (desktop only; the porch section
  is hidden on phones).
- **Pinned bar (phones)** — `.mobile-cta` after `</main>` is a `<div>` holding
  the two commission actions: "Message me" (wide, amber, Messenger) and "Call
  me back" (outlined, the calendar link). Both stay on one line at 375px. It
  shows once the hero is off screen and hides over the closing section and
  footer.
- **Reviews** — the three `.reviews` figures simply stack, all visible.
- **Now-playing pill** — when a playing card scrolls away, `.now-playing` offers
  the way back to it and a stop button. `startSong`/`stopSong` drive it.

## Weekly song update

- The `#weekly-song` spotlight now sits directly below the hero. Its artwork
  is a play control; `#weekly-player` uses the same in-page player and shared
  one-at-a-time playback state as the other song cards. Never autoplay on load.
- To swap the week's song, edit only the **first entry of the `songs` array** in
  `script.js` — `[videoId, sceneKeyword, label, title, description, artwork?]`. That entry
  fills the spotlight title, description and player. The remaining entries fill
  the gallery and its drawer, so the weekly song is not duplicated there.
- The optional `artwork` path serves a verified full-resolution cover from
  `assets/`. If absent, other cards keep their YouTube thumbnail behavior.
  The weekly song and Lenay currently use local 1280×720 YouTube artwork.
- Cut covers as **WebP** unless the art compresses badly there. The card's
  `<img>` has no `<picture>` fallback, but it already sits beside an unguarded
  `assets/*.webp` scene backdrop in the same markup, so WebP support is a
  hard requirement of the card either way — a JPEG sibling would never be
  fetched. The `ItemList` mirrors whichever file the entry names, and Google
  reads WebP in structured data. Check the numbers per image rather than
  assuming: on this week's wildflower-field cover WebP q75 matched JPEG q82's
  PSNR at 25% fewer bytes, but a flatter image can land much closer.
- `buildFace(song, true)` builds the weekly thumbnail; `stopSong` restores that
  same featured face when the player closes.
- **Every local cover needs an 800px gallery copy.** The weekly spotlight
  shows the full 1280×720 file; gallery and drawer cards show it at a third
  of that, so `buildFace` asks for `<name>-800.<ext>` there and falls back to
  the full file if it is missing. After adding or replacing a cover, run
  `python3 tools/build-song-thumbs.py` and commit the `-800` file with it;
  `tests/seo.test.mjs` fails if one is missing. This roughly halved the
  phone's first load.
- `sceneKeyword` picks the fallback backdrop: `wedding` and `kitchen` →
  `wedding.webp`, `teacher` → `studio.webp`, anything else → `porch.webp`.
  The backdrop is only fetched when a card's artwork fails to load; it is
  not in the card's markup otherwise.
- When changing the actual weekly selection, update the Jukebox's `songs.json`
  spotlight in the same pass. A layout-only change does not change its selection.
- Changing any entry also means updating the `ItemList` in `index.html`'s JSON-LD
  in the same commit; `tests/seo.test.mjs` enforces it.
- The testimonials are general studio feedback in their own section after the
  spotlight, not a claimed reaction to the weekly song. All three (Jane,
  Dolores, Susan) live in `.featured-reaction`'s `.reviews`, stacked;
  their text and authors remain intact. There is no lower testimonials
  section any more.

## Structured data and analytics

- The JSON-LD in the head duplicates content that `script.js` renders. **If you
  change the `faq` array, the `songs` array, or the testimonial blockquotes,
  update the JSON-LD in the same commit** — `tests/seo.test.mjs` fails when they
  drift apart.
- The `ItemList` node is the songs' only crawlable form: the cards are injected
  by JavaScript, so no song title or description reaches the served HTML. Each
  entry mirrors one `songs` entry — name, description, YouTube URL, and the same
  artwork the card shows (the local `assets/` file when the entry has one, the
  `hqdefault` thumbnail otherwise), in the same order, credited to `#business`.
  There is deliberately no `genre`: the third field of a `songs` entry is a card
  label ("This week's song"), not a musical genre. Adding `uploadDate` and
  switching these to `VideoObject` would open up video rich results, but only
  with the real upload dates — don't invent them.
- Review markup must describe only the testimonials actually visible on the page
  (currently three), and `aggregateRating.reviewCount` must match.
- GA4 tag is `G-TB4NQVQ8VZ`. The tracked events are `scroll_depth`,
  `section_view`, `generate_lead`, `messenger_click`, `callback_click`,
  `sms_click`, `tel_click`, `cta_click` and `song_play` (fired when a song card's — or the
  WBOY lightbox's — player opens). **One contact tap is one conversion:** a
  tap on Message me (`m.me`), Book a callback (`calendar.app.google`), text
  (`sms:`) or call (`tel:`) fires its own
  channel event plus a single `generate_lead`; an email tap fires
  `generate_lead` alone. `generate_lead` carries `method` (`messenger`,
  `callback`, `sms`, `tel`, `email`) and `placement` (`header`, `hero`,
  `pricing`, `callback_section`, `closing`, `sticky`, `footer`; `keepsake`
  comes from keepsake pages). `cta_click` now fires only for jukebox links
  (`hear_songs`); it must not be sent beside `generate_lead` again, because
  that counted every lead twice. In GA, `generate_lead` should be the only
  key event.
- `section_view` fires when half a section is on screen **or** the section
  fills half the screen. The second condition is there because a section
  taller than two phone screens can never be 50% visible; the old price
  section was never counted on phones for that reason.
- Song and FAQ content is injected by JavaScript, so it isn't in the served
  HTML. The FAQ is covered by the FAQPage JSON-LD; keep that in mind before
  moving any more copy into `script.js`.
- `robots.txt` is at the domain root now and names the sitemap, so crawlers
  find it. Still submit `sitemap.xml` in Google Search Console for the
  `heartstringswv.com` property, and bump its `lastmod` on real changes.

## Keepsakes and the studio ask (November 2026)

The November 2026 audit found keepsake pages are the real front door: 270 of
303 sessions landed on one, with 0 leads, and the only link to the studio
was one line in the footer.

- **New keepsakes carry one quiet line under the song player**, built by
  `keepsake-builder.html`: "This song was written for one family. I’d be
  honored to write yours. Message me →", signed "Tim, Heartstrings Studio".
  The owner chose that wording. The link (`a.ask-link`) opens Messenger to
  the studio's Facebook Page, `https://m.me/61584734289007`.
- It appears on *Keepsake delivery* pages only, once a song is attached.
  **Never on a *First listen* page**, which is for the client alone. It is
  not hidden on `?share` links: the people a song is shared with are exactly
  who it is for.
- **Do not edit keepsakes that have already been delivered.** The owner
  decided those stay exactly as the families received them. This applies to
  the keepsakes repository as a whole.
- The footer's "Have someone worth a song? Visit Heartstrings Studio →"
  (`a.cta`) stays as the one link home. Those two are the only asks on the
  page; don't add a third.
- Keepsakes now send `song_play` (first press of play), `messenger_click` +
  `generate_lead` (`method: messenger`, `placement: keepsake`) for the ask,
  and `studio_click` for the footer link.

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

- The master is `heartstrings-mark-MASTER-1254.png` in the studio's Drive
  (Misc Graphics), not any file in this repo — a 1254×1254 transparent RGBA
  PNG, and every shipped size is a downscale of it. Cut new sizes from the
  master rather than from `assets/logo.png`, which is already downscaled.
  Don't confuse it with `heartstrings-lockup-black-2026-09.png` in the same
  folder: that one is the full lockup (mark plus wordmark) on solid black, so
  cutting from it bakes in the black square and the type.
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
- `assets/share-card.jpg` and `banner.jpeg` are a fifth and sixth appearance,
  outside those four: the cards a link renders in a feed — the first for this
  page, the second for a keepsake with no song linked yet. Rebuild both from
  the master with `tools/build-share-card.py` (`card`, `banner` or `both`)
  whenever the mark changes, or a shared link keeps showing the old brand long
  after the page itself is fixed. They share the Story Room card's ground,
  type and gradient rule so everything the studio puts in a feed reads as one
  brand — redraw one and redraw all three. The banner takes a horizontal
  lockup because it is locked to 3.2:1 (see above); the other two are centred
  stacks.
- **`assets/tim.jpeg` is a seventh appearance of the mark. It is up to date —
  what follows is a constraint on the *next* change, not an outstanding job.**
  The Meet Tim portrait (September 2026, replaced in `#122`) shows Tim wearing
  the branded shirt, embroidered with the current copper/blue mark, so the mark
  is baked into the photograph. Nothing here needs doing today. But because it
  lives in a photo, no re-export can ever update it: if the mark's *shape*
  changes again, this is the one place that needs a new shoot rather than a new
  file, so budget the reshoot into that change instead of finding it
  afterwards. A pure resize or cleanup of the existing shape leaves it alone.
  Either way it is not one of the four files above.

## Delivery and rush wording

The owner set these (the rush definition on 12 November 2026):

- **Standard delivery is "48–72 hours, guaranteed".** Never "most songs".
- **Memorial songs are always ready in 24 hours at no extra cost.** Never
  imply a memorial family pays for speed.
- **Paid rush is a 24-hour turnaround, guaranteed, for +$50.** It applies to
  non-memorial songs only.
- **Any copy that prices rush must state the memorial exception right beside
  it.** The price card reads "Rush delivery, 24 hours guaranteed +$50" with
  "Rush is never charged on memorial songs. They are always ready in 24
  hours." under it. In the markup each price `<b>` comes before its label, so
  the floated price stays on the label's first line on narrow phones. The FAQ
  states the free memorial promise before it prices rush.
- The 24-hour figure belongs in those places only: the memorial band, the
  rush add-on, the "How fast" FAQ answer, and the memorial page. Don't use it as a general
  promise in the hero, the steps or the meta descriptions; those say
  48–72 hours.
- **What $150 includes, confirmed by the owner (12 November 2026):** a fully
  produced custom song, a one-on-one consultation, one round of lyric
  revisions, a permanent keepsake page, an MP3, a printable lyric sheet, an
  MP4 share video (delivered through Google Drive), custom album art, and
  the remake guarantee ("If the finished song misses the mark, I start over
  from scratch"). All of these are real; don't trim them from the price
  card. YouTube is not a deliverable.
- The price card's other add-on is "Commercial license +$100". The owner
  confirmed on 2026-10-29 that the license is a real, current offer, so
  leave it there.

## Commission path (Message me first, text or call beside it)

Changed November 2026 after a conversion audit: visitors arrive from
Facebook, so the primary action keeps them in it.

- **Primary path on every commission CTA is "Message me"**: a Messenger link
  to the Heartstrings Studio **Facebook Page** (never a personal profile),
  `https://m.me/61584734289007`. It is in the header ("Message me"), the hero,
  the pricing card, the closing section and the pinned phone button
  ("Message me for a song"). If the Page claims a username, swap the link
  everywhere at once (`index.html`, `404.html`, `tests/seo.test.mjs`).
- **Directly under the hero, memorial band, pricing and closing buttons** sits
  `<p class="reach-options">`: "Or text me · call 304-677-1113", both tappable
  (`sms:+13046771113`, `tel:+13046771113`). Nothing else goes in that group.
  The public number is 304-677-1113 and the visible form is always
  `304-677-1113`. Email lives only in the footer ("Email me").
- **Response promise:** "I answer myself, usually the same day." Keep it in
  the reach line and the FAQ; do not promise a faster or fixed window.
- **All copy is first person singular** ("I", "me"). Never "Tim" in the third
  person in the studio's own voice, never "we/us/our". Customer quotes keep
  their own words.
- **The Story Room is gone from this page**: no links, no mentions, no
  occasion pills. It was removed on the owner's decision (about one click in
  a month). Don't restore it.
- **Secondary action is "Book a callback"**: the owner's Google Calendar
  appointment page, `https://calendar.app.google/oDX7GcemevPmH2u1A`, opened
  in a new tab and never embedded. It is always `class="button ghost"` (the
  outlined button) so it reads as second to the amber Message me. It is in
  the hero, its own `#callback` section right after the price card ("Rather
  talk it through?"), the closing section, and the pinned phone bar ("Call me
  back"). The `#callback` card states the hours and length under its button:
  "I take calls every day, 8 to noon and 4 to 6 Eastern. Calls are about 15
  minutes." Those come from the owner's appointment schedule (15-minute
  slots); if the schedule changes, change this line with it.
- Nothing else on the page is a `class="button"`: the jukebox is a
  `text-link` ("Explore the jukebox"). The hero has no listen link of its
  own; the scroll cue leads to the weekly song.
- Message me is also the button in the memorial band, with the text and
  call links under it.
  `tests/seo.test.mjs` pins all of this, plus
  `telephone: "+1-304-677-1113"` on the `#business` JSON-LD node.
- The hero carries the price line ("$150 flat · Ready in 48–72 hours,
  guaranteed") above the button and one proof line (`.hero-proof`: 100+
  songs, the WBOY link, the stars) below it. The old four-cell proof bar and
  its count-up are gone; "100+" needs no upkeep.
- Step 01, the FAQ and its JSON-LD describe the same path (message, text,
  call, or book a callback); change them together.
- The Product JSON-LD `offers.url` is the price card,
  `https://heartstringswv.com/#pricing`.
  `tests/seo.test.mjs` pins it.
- `404.html` follows the same path: its commission link is "Message me for a
  song", beside "Back to the studio" and "Hear the songs".
- There is **no inline order form** on the page (it was removed).

## Old audits

- `docs/archive/` holds `AUDIT.md` (July 2026) and `AUDIT-REPORT.md` (August
  2026). Both predate the September rebuild and are stale; don't act on them.
  The November 2026 audit was deliberately kept out of the repo (it quotes
  analytics, and GitHub Pages would serve it); the owner has a copy.

## Design skill (Impeccable)

- `.claude/skills/impeccable` is the Impeccable design skill (v4.4.0,
  Apache 2.0, from `pbakaus/impeccable`), installed skill-only with no edit
  hooks. Run it as `/impeccable <command> <target>`, e.g. `audit index.html`.
- `PRODUCT.md` is its product record, written by `/impeccable init`. It points
  back here: **this file wins** over any Impeccable default, especially on the
  walnut/amber palette, Libre Caslon Display + DM Sans, the `?v=` cache rule
  and the Message me links. Treat its suggestions as refinements of the current
  system, never a redesign, unless the owner asks for one.
- Its launcher downloads a checksum-verified engine binary from the project's
  GitHub releases into `~/.impeccable/` on first run. Nothing is committed.
