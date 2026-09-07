# Link tagging & analytics setup

Everything here exists to answer one question: **which channel brings inquiries.**
Right now 60% of sessions land in GA4 as "Direct", which means unattributed.

## 1. Tag every link you post

Paste the tagged version, never the bare URL. Three parameters, always in this order.

| Where you post it | Link |
|---|---|
| Facebook page post | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=facebook&utm_medium=social&utm_campaign=weekly-song` |
| Facebook local group | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=facebook&utm_medium=social&utm_campaign=local-group` |
| Facebook — straight to the Jukebox | `https://heartstringsstudio.github.io/jukebox/?utm_source=facebook&utm_medium=social&utm_campaign=jukebox` |
| TikTok bio / caption link | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=tiktok&utm_medium=social&utm_campaign=bio` |
| YouTube description | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=youtube&utm_medium=video&utm_campaign=song-desc` |
| Funeral-home one-sheet / QR code | `https://heartstringsstudio.github.io/storyroom/?utm_source=funeral-home&utm_medium=print&utm_campaign=partner-sheet` |
| Business card QR | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=card&utm_medium=print&utm_campaign=business-card` |
| Email signature | `https://heartstringsstudio.github.io/heartstringsstudio/?utm_source=email&utm_medium=signature&utm_campaign=evergreen` |

Rules of thumb:

- `utm_source` = the place it was posted (facebook, tiktok, youtube, funeral-home).
- `utm_medium` = the kind of place (social, video, print, email, referral).
- `utm_campaign` = what the post is about (weekly-song, memorial-push, holiday-2026).
- Lowercase, hyphens, no spaces. `Facebook` and `facebook` count as two sources.
- Tag a **new** campaign for anything you'll want to judge on its own.
- Never tag an internal link between the main page, the Jukebox and the Story Room —
  that restarts the session and erases where the person actually came from.

The page also stores the source on arrival and stamps it onto every `cta_click` and
`generate_lead`, so a tagged link tells you the channel of the inquiry, not just the visit.

## 2. Two settings only you can change (GA4 admin, property 532537672)

1. **Mark the key events.** Admin → Data display → Events → toggle "Mark as key event"
   on `generate_lead` and `cta_click`. Until this is on, GA4 reports 0 conversions no
   matter how many people raise a hand.
2. **Filter your own traffic.** Admin → Data streams → the web stream → Configure tag
   settings → Define internal traffic → add your home IP, then Data settings → Data
   filters → set "Internal Traffic" to **Active** (it ships as Testing, which does
   nothing).

For visits from a phone or anywhere off your home network, load any page once with
`?ga=off` — that device stops counting until you load `?ga=on`.

## 3. What to read next month

- `generate_lead` by `traffic_source` — the actual answer to "is Facebook working."
- Jukebox users vs. main-page users — the Jukebox holds attention twice as long.
- Story Room average engagement time — 22s is the number to beat.
