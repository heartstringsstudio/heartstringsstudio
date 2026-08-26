# Heartstrings Studio — project notes

## Editing `index.html`

- **Do not use the "upload index.html" path in the GitHub web UI.** It replaces
  the whole file with whatever local copy is picked, which is exactly how the
  intake-form wiring got clobbered (commit `7b1e359` reverted all the `/intake/`
  links and restored the old inline order form). Make changes via commits/PRs
  that build on the current file instead.

## Weekly song update

- The weekly embed is a **thumbnail facade**, not an iframe. To swap the week's
  song, update the facade inside `.weekly-song-embed` in **three places** —
  the `href`, `data-yt`, and the `img src` video id — plus the song name in
  `data-title` and `aria-label`. The Jukebox's `songs.json` spotlight should be
  updated in the same pass.

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
  variants such as "Commission Your Song", "Begin Your Song", and the sticky-nav
  CTA. None of them should point to an inline/on-page form.
- The occasion pills also link to `/storyroom/` and deep-link with `?occasion=...`.
- There is **no inline order form** on the page (it was removed). Clicks through
  to `/storyroom/` are tracked in GA via `cta_click` / `generate_lead` events.

