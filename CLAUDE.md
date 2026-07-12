Exit code: 0
Wall time: 0.9 seconds
Output:
# Heartstrings Studio — project notes

## Editing `index.html`

- **Do not use the "upload index.html" path in the GitHub web UI.** It replaces
  the whole file with whatever local copy is picked, which is exactly how the
  intake-form wiring got clobbered (commit `7b1e359` reverted all the `/intake/`
  links and restored the old inline order form). Make changes via commits/PRs
  that build on the current file instead.

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

