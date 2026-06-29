# Heartstrings Studio — project notes

## Editing `index.html`

- **Do not use the "upload index.html" path in the GitHub web UI.** It replaces
  the whole file with whatever local copy is picked, which is exactly how the
  intake-form wiring got clobbered (commit `7b1e359` reverted all the `/intake/`
  links and restored the old inline order form). Make changes via commits/PRs
  that build on the current file instead.

## Intake form

- The client intake form lives at `https://heartstringsstudio.github.io/intake/`
  and is served from a **separate source** — it is not in this repo.
- All main-site CTAs ("Begin Your Song" buttons) and the occasion pills should
  link to `/intake/` (pills deep-link with `?occasion=...`). There is no inline
  order form on the page; clicks to `/intake/` are tracked in GA via
  `cta_click` / `generate_lead` events.
