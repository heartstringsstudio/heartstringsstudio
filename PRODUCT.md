# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Adults, mostly 40 and over, buying a custom song as a gift or a memorial for
someone they love: weddings, anniversaries, birthdays, retirements,
celebrations of life. Many arrive grieving or short on time. Most visit on a
phone, often from Facebook or TikTok, and some on a slow rural connection.

## Product Purpose
Heartstrings Studio turns a client's memories into a finished, produced song
with a personal keepsake page. The homepage helps a visitor hear real songs,
trust the person who writes them, understand the price and process, and then
tell their story in the Story Room. Success means a click through to
`/storyroom/` (tracked as `cta_click` / `generate_lead`).

## Positioning
One real songwriter, Tim Harbert of Lumberport, West Virginia, personally
writes every song from the client's own words: names, memories, inside jokes.
It has Appalachian roots, a flat $150 price, delivery in 48–72 hours and a
keepsake page. Memorial songs always get free 24-hour delivery.

## Operating Context
- Commissions start in the Story Room
  (`https://heartstringsstudio.github.io/storyroom/`), which is served from a
  separate source. There is no form on this page.
- Delivery: the client sees the lyrics first and gets one revision round
  before production. The keepsake page arrives by email with the song, custom
  artwork, full lyrics, an MP3, a lyric sheet and an unlisted YouTube link.
- One song is featured each week (`#weekly-song`), and the full catalogue
  lives in the Jukebox.
- Distribution happens on Facebook, TikTok and YouTube.

## Capabilities and Constraints
- Static GitHub Pages site: `index.html`, `style.css` and `script.js`, plus
  the keepsake builder and its template. `npm test` must pass before pushing.
- Price: $150 flat. Add-ons: rush delivery +$50 and commercial license +$100.
  Any copy that prices the rush must say memorial songs are always delivered
  in 24 hours at no extra cost.
- If the finished song misses the mark, Tim starts over from scratch.
- Songs play in place using an on-demand `youtube-nocookie` player. Keep the
  offline and slow-load fallbacks.
- Song and FAQ copy is rendered by `script.js` and mirrored in the JSON-LD;
  the two must change together.
- **CLAUDE.md is the binding operating manual for this repo.** Read it before
  any design or code change; it overrides Impeccable defaults wherever they
  conflict.

## Brand Commitments
These are binding constraints set by the owner. Preserve them; do not
reinterpret or expand them:

- **Palette:** the warm walnut/amber system, with `--bg:#271c16` and
  `--accent:#f0b86f` on the dark ground. The satellite pages use the cream
  light-ground half of the system documented in CLAUDE.md.
- **Type:** Libre Caslon Display (one weight, 400, no italic; upright
  headings only), DM Sans for body text, and Georgia for italics and serif
  running text.
- **Cache busting:** bump the `?v=` on the `style.css` link (and on any logo
  URL) whenever that file changes.
- **Story Room links:** every commission CTA links to `/storyroom/`, and
  occasion pills deep-link with `?occasion=`. "Hear this week's song" is the
  one exception; it targets `#weekly-song`.
- **Voice:** warm, reflective and Appalachian-rooted. Plainspoken and never
  salesy. Tender with memorial families.
- **Name and mark:** "Heartstrings Studio" plus the studio mark, which has
  four synced files. See "The studio mark" in CLAUDE.md.

## Evidence on Hand
- Three real testimonials: Jane H., Dolores B. and Susan H. Never invent more,
  and keep the JSON-LD review count in step with them.
- "111 stories turned into songs" (the count-up in the proof bar).
- A WBOY "304 Today" TV segment featuring Tim.
- Real songs on YouTube, listed in the `songs` array in `script.js`.
- Photography: `assets/studio.webp`, `porch.webp`, `wedding.webp` and the
  `tim.jpeg` portrait.
- No press quotes, awards, ratings platforms or upload dates are on hand. Do
  not fabricate any of them.

## Product Principles
1. The client's story is the product. Design gets out of the way of the songs
   and the words.
2. A real person, not a template. Tim's presence and the WV roots carry the
   trust.
3. Gentle with grief. Nothing pressures, hurries or upsells a memorial family.
4. Built for rural phones. It must stay fast, usable offline and usable with
   scripts off.
5. One clear path. Every commission action leads to the Story Room.

## Accessibility & Inclusion
WCAG 2.2 AA. The audience skews older, so keep body text comfortably large and
contrast high. Everything already in place must survive future changes:
honoring `prefers-reduced-motion`, the pause control on the rotating reviews
(2.2.2), and the walnut focus rings on cream pages.
