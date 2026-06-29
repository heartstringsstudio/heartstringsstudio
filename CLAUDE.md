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
- **Every** main-site CTA must link to `/intake/` — this includes all wording
  variants: "Begin Your Song", "Start Your Song", "Start Your Own Song", and the
  sticky-nav CTA. None of them should point to an inline/on-page form.
- The occasion pills also link to `/intake/` and deep-link with `?occasion=...`.
- There is **no inline order form** on the page (it was removed). Clicks through
  to `/intake/` are tracked in GA via `cta_click` / `generate_lead` events.
