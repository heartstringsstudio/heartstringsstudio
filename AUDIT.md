# Heartstrings Studio — Site Audit

**Audited:** 11 November 2026
**Short link:** `tinyurl.com/heartstringswv` → one redirect → **`https://heartstringsstudio.github.io/heartstringsstudio/`** (the page audited; it matches `main` at commit `4e66c83`)
**Analytics:** GA4, 14 Oct – 10 Nov 2026 (219 users, 303 sessions). Small sample; treat percentages as directional.
**Screenshots:** `audit-screens/` — `mobile-390-first-screen.jpg`, `mobile-390-full-page.jpg`, `desktop-1440-first-screen.jpg`, `desktop-1440-full-page.jpg`
**No code was changed.**

A "screen" below means one 390 × 844 phone screen. Real visible height inside the Facebook app is shorter (roughly 660–750px), so every "screens down" figure here is the kind version.

---

## Executive summary

1. **The main page is not where your visitors are.** 270 of 303 sessions (89%) land on two keepsake pages. Those pages produced 0 leads and at most 8 visits onward to the main site (3%). The main page saw 21 people in 28 days.
2. **Real lead actions in 28 days: about 3, from at most 2 people.** GA reports 6 "key events", but every tap on Text Tim fires three events, two of them counted as conversions. Nobody tapped Call. Nobody tapped Email. There is no internal-traffic filter, so some of these may be you.
3. **On a phone the page is 14 screens long and the first real booking button sits 10 screens down.** The hero's big button says "Hear this week's song". Booking is a small underlined text link. The price falls on the fold line. The name "Heartstrings" is 14px tall.
4. **There is no Messenger link anywhere on the site.** Your chosen primary action does not exist yet. The Story Room, which you are removing, has 11 links; Text Tim has 5.
5. **The build quality is already high.** Lighthouse mobile: Performance 95, Accessibility 100, Best Practices 96, SEO 100. Speed is not why people leave. Structure, length and the missing button are.

### The 3 changes most likely to increase bookings

1. **Put "Message me" on the keepsake pages**, directly under the song player. That is where 89% of your audience is, at the exact moment the song has just moved them.
2. **Rebuild the first phone screen:** studio name large, one line of what I make, "$150 flat", a **Message me for a song** button and a **Book a callback** button. Pin both to the bottom of the screen for the whole page.
3. **Cut the page from 14 screens to about 7** and move a song sample, the WBOY badge and "100+ songs" into the first two screens.

---

## Where the data and my eyes disagree

| Your read / my visual read | What the numbers say |
|---|---|
| "Visitors leave within a minute." | True for the **Rest Now, Chief** keepsake (49s per session, 61.6% bounce, 156 users). The main page is 42s per landing session with a 31.3% bounce, on only 29 landing sessions. You cannot yet say the main page "doesn't convert"; it has barely been visited. |
| "Almost nobody reaches the bottom." | Supported. Only 7 of the 21 main-page users fired any `scroll_depth` mark, and the first mark is 25% (about 3.5 screens). Two thirds of visitors never got past the song gallery. The price card starts at 8.6 screens. |
| GA report: "`song_play` is broken, 4 plays on ~350 song-page views." | Not broken. `song_play` only exists on the main page, where it fires correctly (4 plays from 3 of 21 users). The keepsake pages play a plain audio file and **send no play event at all**. Plays there are simply uncounted. |
| GA report: "`cta_click` and `generate_lead` may double-count." | Confirmed in `script.js`, and it is worse: one tap on a text link sends `sms_click` + `cta_click` + `generate_lead`. The 6 key events are 3 actions. The most consistent reading is 2 text taps by one person plus the single Story Room visit. |
| GA report: "iPhone visitors engage far less (39s vs 4m14s); check for iOS problems." | Lab speed is fine (LCP 2.7s on a throttled phone). The iPhone gap tracks the *Rest Now, Chief* audience, a wide Facebook share to people who did not know the family. That is an audience difference more than a bug. Still test on a real iPhone inside the Facebook app; I could not. |
| My eyes: desktop looks like an expensive site. | Desktop is about 10% of users. The phone layout is the weaker one and carries 85%. |
| "Mama, Why" is a 6.2 MB page (art and PDF baked into the HTML); "Rest Now, Chief" is 1.4 MB. | The heavier page has the *better* engagement (3m05s, 36% bounce), so weight is not what is driving people off. It is still worth fixing for rural connections. |

---

## Step 2 — The 5-second test (phone, first screen only)

See `audit-screens/mobile-390-first-screen.jpg`.

| Question | Grade | Why |
|---|---|---|
| (a) Is this Heartstrings Studio? | **D** | The name is 14px letter-spaced capitals beside a 40px mark. "STUDIO · WEST VIRGINIA" is smaller still. The largest words on screen are "Who would you give a song to?", which could belong to anyone. The biggest appearance of the logo is on Tim's shirt. |
| (b) What do I make? | **B** | "CUSTOM SONGWRITING" and "I turn your memories into a custom song for someone who matters" are clear. The headline is a question the visitor has to answer before they learn anything. |
| (c) What does it cost / how do I start? | **D** | "$150 flat · Delivered in 48–72 hours" is 12.8px and sits at 835px, on the fold line of an 844px screen and below it inside the Facebook app. The price is not seen without scrolling. |
| (d) What do I tap next? | **C** | One large amber button, and it says "Hear this week's song". The booking action is a 34px-tall underlined link beneath it. A visitor ready to ask for a song has no button. |

The header alone is 144px (17% of the screen): a logo row plus a second row of four nav links, one of them labelled "Investment" for a $150 purchase.

---

## Step 3 — Section inventory (phone, top to bottom)

Total page height: **11,833px = 14.0 screens.**

| # | Section | Purpose | Height | Verdict |
|---|---|---|---|---|
| 0 | Header (logo + 4 nav links) | Identity, navigation | 0.2 | **REWRITE** — one row, bigger name, drop the nav row on phones |
| 1 | Hero | First impression | 0.9 | **REWRITE** — see Step 5 |
| 2 | This week's song | One playable sample | 0.65 | **KEEP**, tighten; this is your best asset this high up |
| 3 | Rotating reviews | Trust | 0.4 | **REWRITE** — show all three, stop rotating |
| 4 | Proof bar (115 / 48–72h / ★ / WBOY) | Trust | 0.3 | **MOVE** up into the hero as one line |
| 5 | Occasion pills (9) | Route to Story Room | 0.4 | **CUT** as a section; every pill links to the Story Room |
| 6 | Song gallery (12 cards, sideways swipe) + jukebox invite | Samples | 1.9 | **MERGE** — 3 cards (memorial, wedding, tribute) + one text link to the jukebox. Cut the dark jukebox block |
| 7 | Porch statement ("A photo shows the moment…") | Mood | 0.8 | **CUT** on phones. Beautiful on desktop, a full screen of no information on a phone |
| 8 | Keepsake (photo + 3 tilted cards) | What you get | 1.9 | **MERGE** into pricing. It repeats the price card's list at twice the height |
| 9 | Process (3 steps) | How it works | 1.1 | **REWRITE** shorter, first person, no Story Room |
| 10 | Pricing | Price, deliverables, first booking button | 2.1 | **MOVE** up and shorten |
| 11 | Meet Tim | The person, WBOY video | 1.4 | **KEEP**, shorten, move the real photo into the hero |
| 12 | FAQ (7) | Objections | 1.0 | **KEEP**, cut to 5 |
| 13 | Closing CTA | Last ask | 0.7 | **REWRITE** with the two new actions |
| 14 | Footer | Links | 0.2 | **KEEP** |

**How far down is the first booking button?**
- A booking **text link** ("Text Tim about your song") is in the hero at 0.9 screens, below the fold inside the Facebook app.
- The **pinned button** appears once the hero scrolls away, at about 1.1 screens.
- The first booking **button in the page itself** is in the price card at **8,520px = 10.1 screens.**
- The first "Message me" (Messenger) button: **does not exist.**
- The price in readable size ($150 on the price card): **8.9 screens.**

---

## Step 4 — Recommended order

Built for someone on a phone, arriving from Facebook, possibly days after a death, deciding in seconds.

| # | Section | Why it is here |
|---|---|---|
| 1 | **Hero**: name, what I make, $150, two buttons | Answers who / what / how much / what next without a scroll |
| 2 | **Proof line**: 100+ songs · As seen on WBOY 304 Today · ★★★★★ | Trust before the first scroll ends, not at screen 2.3 |
| 3 | **Hear one**: this week's song, then three more by occasion | The product sells itself; let them hear it inside the first two screens |
| 4 | **For memorial families**: free 24-hour delivery + Message me | Your largest and most urgent group gets its own answer early |
| 5 | **What people said**: all three quotes, visible at once | Rotating quotes hide two of three from most visitors |
| 6 | **How it works + what you get + price**: one section | Steps, deliverables and $150 are one thought; today they are three sections and 5 screens |
| 7 | **Book a callback** | For people who would rather talk than type (older relatives, the freshly bereaved) |
| 8 | **About me**: short, real photo, WBOY video | By here they are deciding whether to trust the person |
| 9 | **FAQ** (5 questions) | Catches the last objections |
| 10 | **Closing**: both buttons + phone number | Final ask |

Target length: **7 screens or fewer.**

**Move off this page:**
- The full song catalogue already lives in the Jukebox. Keep one text link to it; drop the 0.6-screen invite block.
- A dedicated **memorial page** (see Big Moves). A grieving visitor should land on a page that speaks only to them, and it is the one place the 24-hour promise belongs in the headline.

**Sticky "Message me" bar on phones: yes.** You already have a pinned button, so this is a rewrite, not a new feature. Make it two actions, **Message me** (wide, amber) and **Call me back** (narrow, outlined), slimmer than today's 68px, and show it from the first scroll. Today's bar covers content it sits over (the WBOY link in the Meet Tim section, the last lines of the price list); give the page bottom padding equal to the bar's height.

---

## Step 5 — Hero concepts

### Concept A — "The nameplate" (recommended)
The studio name is the biggest thing on screen. The mark sits above "Heartstrings Studio" set in the display serif at headline size. Under it: "I write custom songs from your memories." Then "$150 flat · 48–72 hours". Then the two buttons. Behind it, the **real photograph of Tim** from the Meet Tim section, darkened, instead of the current illustrated scene. A small "▶ Hear a song" chip sits under the buttons.
- Why: fixes all four 5-second grades at once, and the people arriving mostly know Tim, so his actual face is the strongest trust signal you own. The current hero picture is an illustration (its own alt text calls it "a portrait-inspired scene"); the real photo is buried 12 screens down.

### Concept B — "Press play first"
The hero *is* a song. Slim name bar on top, then full-width album art with a large play button and the line "This is what a memory sounds like." Buttons below.
- Why it tempts: the songs are the product, and only 3 of 21 visitors played one.
- Why not: the name is still secondary, and the player is a YouTube embed that has to load on tap over a rural connection inside an in-app browser. If it stalls, the first impression is a spinner.

### Concept C — "Porch at dusk" (large animated or 3D background)
Full-screen living scene: hills in layered parallax, fireflies, a porch light that flickers, the name lettered across the sky. Done in WebGL/3D or as a looping video.

**Honest evaluation of the animated/3D route:**
- **Payoff:** real on a desktop monitor, where 10% of your visitors are. On a 390px screen inside the Facebook app, the scene is the size of a postcard and competes with the name and the buttons for the same space.
- **Load:** a 3D library adds roughly 150–600 KB of script before anything draws; a background video adds 1–3 MB. Your whole first load is 0.9 MB today, with the main image appearing at 2.7s. This would likely double both.
- **Battery and heat:** continuous GPU drawing on a phone, on a page people are meant to read slowly.
- **Accessibility:** visitors with reduced-motion set must get a still image instead, so you pay to build two heroes. A canvas also gives screen readers nothing.
- **Tone:** a grieving visitor is not looking for spectacle. Motion that performs reads as marketing; stillness reads as care.
- **Verdict: do not build it.** No WebGL, no 3D, no background video.

**What to do instead:** take the cheap part of C into A. The fireflies you already built (14 tiny CSS dots, no library, already off for reduced motion) move from the porch section up into the hero, plus a very slow drift on the photo. Cost: effectively zero bytes. That gives the hero life without costing load time.

**Recommendation: Concept A, with the firefly layer from C and the play chip from B.**

---

## Step 6 — Premium polish

**Verdict: too much going on, and the same thing going on too many times.** The palette, photography direction and desktop composition are strong. What stops it reading as a $10,000 site on a phone is repetition and ornament.

**Typography**
- Three typefaces are in play, not two: Libre Caslon Display (big headings), **Georgia** (card titles, step titles, quotes, pull quote) and DM Sans (body). On a phone, a Georgia card title directly under a Caslon heading looks like a font failed to load. Pick one serif for every heading level.
- There is no type scale. The stylesheet has **60 different font-size values**. On a phone the section headings are 38, 40, 48, 48, 48 and 56px for the same level of heading. High-end sites use 5–7 sizes, total.
- Small text is too small for this audience: eyebrows and the price line are 12.8px, labels 12px, the jukebox tags 12.5px. Many of your visitors are over 50. Floor it at 14px.
- The pairing itself (high-contrast display serif + plain sans) is right. Keep it.

**Spacing and rhythm**
- Every section follows the same recipe: small amber capitals, a two-line heading, second line in italics. It appears 8 times. By the third it reads as a template.
- The Keepsake section spends 1.9 screens to say three bullet points. The dark jukebox block spends 0.6 screens on a link.
- The header's two rows cost 144px before any content.

**Colour**
- Walnut, cream and amber are coherent and warm. No changes needed. Amber should mean "tap here" and nothing else; today it is also every eyebrow, every italic line, the stars, the step numbers and the timeline.

**Images**
- Song artwork is the best-looking thing on the page. Use more of it, higher up.
- The hero is an illustration of Tim while the real portrait is at screen 11. For a business built on personal trust, lead with the real one.
- The 40px header logo is served from a 512px, 84 KB file.

**Motion — the full list currently running**
Handwritten-headline reveal, underline swash, count-up number, fireflies, auto-rotating reviews, travelling timeline dot, fade-in on scroll for a dozen blocks, slow drift on hero and closing images, amber glow drift, 3D tilt on hover, now-playing pill, pinned-scene scroll on desktop. That is twelve effects. Each is tasteful alone. Together they make the page feel busy. **Keep three:** the fade-in on scroll, the fireflies (in the hero), the now-playing pill. Cut the count-up in particular: a visitor glancing at it mid-animation reads "37 stories turned into songs".

**Clutter — specific elements to remove**
- Tilted cards with tilted text: the three keepsake cards on phones, the price card on desktop. Rotated body text is a scrapbook device. Tilt a photo once, never paragraphs or prices.
- The thick 3D "pressed" edge on every button, at 72px tall. Premium service sites use quieter, flatter buttons with generous padding.
- Three separate links in the hero that all scroll to the same song (button, postcard, "HEAR WHAT A MEMORY CAN BECOME").
- The postcard ("Pull up a chair. Stay for a song.").
- "1 of 12 · Swipe for more" on the gallery. Twelve sideways cards is a catalogue; that is the Jukebox's job.
- Pause button and dots on the reviews (they exist only because the reviews rotate).

**What high-end service and studio sites do that this page does not**
- State the name and the offer in the first screen in plain words, with one obvious action.
- Use one or two typefaces on a short, strict scale.
- Let one strong image carry a screen instead of layering a photo, a card, a caption and an animation.
- Show proof (press, numbers, faces) directly under the hero, in a single quiet row.
- Put the price where the customer does not have to hunt for it.
- Repeat the same single call to action, in the same words, every one to two screens.
- Use motion once or twice, on purpose.

---

## Step 7 — Conversion

### Every call to action on the page today

| Link | Count | Where | Works on a phone? |
|---|---|---|---|
| "Text Tim…" (`sms:+13046771113`) | 5 | header (hidden on phones), hero text link, price card, closing, pinned bar | Link format is correct for iPhone and Android. Not tested on a device |
| "Call 304-677-1113" (`tel:`) | 2 | price card, closing | Correct format. **0 taps in 28 days** |
| "Email Tim" (`mailto:`) | 3 | price card, closing, footer | Correct. **0 taps in 28 days** |
| Story Room | **11** | 9 occasion pills, price card, closing | Opens the form. 1 visit in 28 days |
| Jukebox | 4 | gallery text link, invite button, footer, no-script fallback | Works (page returns 200) |
| "Hear this week's song" / scroll links | 4 | hero button, postcard, scroll cue, "Find your kind of song" | Work |
| **Messenger (`m.me`)** | **0** | — | **Does not exist** |
| **Book a callback** | **0** | — | **Does not exist** |

**Problems**
- The one big button in the hero is not a booking button.
- The path you are removing has more than twice as many entry points as your primary path.
- Each contact block offers four choices (text, call, email, Story Room). Adding Messenger and a callback would make six. More choices, fewer taps. Cap it at three: **Message me** (button), **Book a callback** (outlined button), and one plain line with the phone number.
- Your visitors are already inside Facebook. A text link makes them leave the app; a Messenger link keeps them in it. That alone justifies the switch.
- Small tap targets: the hero booking link is 34px tall, "Find your kind of song" and the WBOY link are 28px. The guideline is 44px.

### Trust signals — present, but late

| Signal | Where it is now | Where it should be |
|---|---|---|
| A song you can play | 1.5 screens (weekly song) | Keep; add the play chip to the hero |
| Testimonials | 1.8 screens, one visible at a time | All three visible, after the songs |
| "115 stories turned into songs" | 2.3 screens | Hero proof line, as "100+ songs" |
| WBOY 304 Today | 2.3 screens (small) and 12 screens (text link) | Hero proof line |
| Tim's real face | 10.7 screens | Hero |
| Remake guarantee | 10.2 screens, 13px grey text | Beside the price, at readable size |

### Pricing clarity
- "$150 flat" is clear once found. It is found at 8.9 screens.
- "Rush delivery +$50" does not say what rush buys or that memorials are exempt (see Step 9).
- "Commercial license +$100" has no explanation. One line: who needs it.
- The nav calls the price "Investment". Call it "Price".

### Recommended copy — "Message me for a song"

**Button:** `Message me for a song`
**Line under the button:** `Opens Messenger. I answer myself, usually the same day.`
**Alternative line:** `Or text or call me: 304-677-1113`
**Pinned bar (short form):** `Message me` · `Call me back`

**Hero block**
> **Heartstrings Studio**
> I write custom songs from your memories.
> $150 flat · Ready in 48–72 hours, guaranteed
> [ Message me for a song ]  [ Book a callback ]
> Or [text me] · [call 304-677-1113]
> 100+ songs · As seen on WBOY's 304 Today · ★★★★★

**Memorial band**
> **Lost someone?**
> Tell me about them. Memorial songs are ready in 24 hours, and I never charge a rush fee for one.
> [ Message me ]
> Or [text me] · [call 304-677-1113]

**Closing**
> **You already have the story.**
> Send me a message and tell me who the song is for. I'll take it from there.
> [ Message me for a song ]  [ Book a callback ]
> Or text or call me: 304-677-1113

**The rule for every Message button (hero, memorial band, price card, closing):**
- The button opens Messenger to the **Heartstrings Studio Page** (the Page the footer already links to, `facebook.com/profile.php?id=61584734289007`). Never a personal profile.
- Directly under it, within a thumb's reach, sit the two alternatives as **tappable links**, not plain text: **Text me** (`sms:+13046771113`) and **Call 304-677-1113** (`tel:+13046771113`). Each at least 44px tall.
- Nothing else in that group. No email, no Story Room. Book a callback is the separate outlined button.
- The pinned bar is the one exception: it has room for Message me and Call me back only. The text and call links are never more than one screen away.

**The link itself.** Messenger links take the form `https://m.me/` followed by your Page's username. Your Page currently has a numeric address (`facebook.com/profile.php?id=61584734289007`). Claim a Page username first; `heartstringsstudiowv` would match your YouTube and TikTok handles, giving `m.me/heartstringsstudiowv`. Confirm that messaging is switched on for the Page and that the link opens the **Page's** inbox, not a personal profile. I could not test this from here (Facebook is not reachable from the audit environment).

### Recommended "Book a callback" section

**Where:** as the second button in the hero, the closing section and the pinned bar, plus its own short section directly after the price card (position 7 in the new order). After the price is when "I'd rather just talk to someone" arises.

**What it says**
> **Rather talk it through?**
> Pick a time and I'll call you. Tell me who the song is for and I'll ask the rest. No forms.
> [ Pick a time for me to call ]
> *I call from 304-677-1113, so you'll know it's me.*

**How it looks:** one cream card on the walnut ground, the same card style as the price card but not tilted. Small phone icon, the heading in the display serif, two lines of body text, one outlined walnut button (outlined so it stays visually second to the amber Message button). No calendar embedded in the page; the button opens your Google Calendar appointment page in a new tab. Embedding it would add weight and a second scrolling area on a phone.

**To confirm before publishing:** the hours you will offer, and whether you want to state a call length. I left both out rather than invent them.

---

## Step 8 — Technical

### Lighthouse (mobile, live site, three runs)

| Category | Score |
|---|---|
| Performance | **95** (94–95) |
| Accessibility | **100** |
| Best Practices | **96** |
| SEO | **100** |

First content 1.8s · main image 2.7s · blocking time 60–80ms · layout shift 0 · page weight 911 KB.

The Best Practices deduction is a console error from Google Analytics being blocked by the audit environment's network, not a fault on the site. Read it as 100.

### Largest load-time offenders

| File | Size | Problem |
|---|---|---|
| `assets/porch.webp` | 196 KB | Loads on first view as a backdrop **behind** the weekly song's artwork, where nobody sees it. 1536px wide, shown at 334px |
| Song covers (4 on first load) | 76–151 KB each | 1280px wide, shown at 278–334px. Roughly 4× more pixels than needed |
| `assets/logo.png` | 84 KB | 512px file shown at 40px |
| Google Fonts stylesheet | — | Blocks first paint by about 0.8s. Requests DM Sans 500, which the page never uses |
| Caching | — | GitHub Pages caches files for 10 minutes; nothing to fix without moving hosts |

Lighthouse estimates 744 KB of image savings. None of this is urgent at a score of 95, but it matters on a weak rural signal.

### Links
- All internal pages and files return 200: main page, Story Room, Jukebox, both keepsake pages, sitemap, every image, stylesheet and script.
- `heartstringsstudio.github.io/robots.txt` returns 404. Expected on this kind of GitHub Pages site and already documented in the repo.
- **Not testable from here:** the Facebook, YouTube and TikTok links and the YouTube players (those hosts are blocked in the audit environment). Tap each once on your phone.
- `heartstringswv.com` did not respond. If you own that domain, it is not pointing at the site.

### Meta and Open Graph (what Facebook shows when the link is shared)
- Present and correct: title, description, canonical, `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, two `og:image` entries with sizes and alt text, Twitter card, structured data for the business, product, reviews, songs and FAQ.
- **One real problem:** the first `og:image` is `studio.webp`, the illustrated studio scene with **no studio name on it**. Facebook uses the first image listed. Your branded 1200 × 630 share card is listed second. With effectively 100% of traffic coming from Facebook, swap the order so every shared link carries the name. Then re-scrape the URL in Facebook's Sharing Debugger.
- The description says "Heartstrings Studio writes and produces…". Rewrite in first person to match the rest of the copy.
- Nothing is missing.

### Do the contact links work, and is GA tracking them?
- `sms:` and `tel:` links are correctly formed and are tracked (`sms_click`, `tel_click`).
- There is no Messenger link and no callback link, so there is nothing to track yet.
- I verified tracking by reading the code. I could not watch events arrive, because Google Analytics is blocked in the audit environment.

### Tracking faults found

1. **Triple counting.** One tap on a text link sends `sms_click`, `cta_click` and `generate_lead`. Two of those are marked as key events, so one tap counts as two conversions.
2. **You cannot tell which button was tapped.** Hero, price card, closing and pinned bar all report the same thing.
3. **`section_view` can never fire for the tallest sections on a phone.** It waits for half the section to be on screen. Pricing is 1,752px tall; half of that is taller than a phone screen. The same is true of the song gallery and the Keepsake section inside the Facebook app. Your section data silently under-reports exactly the sections you care about.
4. **Two scroll trackers** (`scroll` built-in at 90%, `scroll_depth` custom at 25/50/75/90/100). Keep the custom one.
5. **Keepsake pages send no events** beyond the page view: no play, no click on the link to the studio.
6. **No UTM tags** on the links you post, so Facebook arrives as four different sources plus "Direct" (97 sessions), and TikTok is invisible. TikTok does not appear in the report at all.
7. **No internal-traffic filter.** Clarksburg and Bridgeport are 79 of 219 users and include you.

### Events to add

| Event | When | Details to send |
|---|---|---|
| `generate_lead` | Any tap on Message, Text, Call or Book a callback | `method`: `messenger` / `sms` / `tel` / `callback`; `placement`: `hero` / `sticky` / `memorial` / `pricing` / `callback_section` / `closing` |
| `messenger_click` | Tap on any `m.me` link | `placement` |
| `callback_click` | Tap on the calendar link | `placement` |
| `song_play` (keepsake pages) | First press of play on the audio player | song title |
| `studio_click` (keepsake pages) | Tap on the link or button to the studio | song title |

Make **`generate_lead` the only key event.** Remove the key-event mark from `cta_click`. Remove the Story Room branch when the Story Room goes.

---

## Step 9 — Copy check against the business facts

### The Story Room — every link, button and mention to remove

| # | Where | What it is | Replace with |
|---|---|---|---|
| 1–9 | `script.js` lines 1–3 | The nine occasion pills (Weddings, Memorials & Tributes, Anniversaries, Birthdays, Retirements, Military Tributes, Celebrations of Life, Gratitude & Thank You, Just Because), each linking to the Story Room | Either remove the row, or keep three (Memorial, Wedding, Tribute) as filters that show a matching sample song. Do not point nine pills at Messenger; that is nine more buttons |
| 10 | `index.html` line 544 | Price card: "Rather write it out? Tell your story ↗" | **Book a callback** (outlined button) |
| 11 | `index.html` line 547 | Closing section: "Rather write it out? Tell your story ↗" | **Book a callback** (outlined button) |
| 12 | `index.html` line 543 | Step 01: "…or write them out in the Story Room…" | "Message me, text me or book a call. Tell me who the song is for and I'll ask the rest." |
| 13 | `script.js` line 241 | FAQ "How does it work?": "Rather write it out? Tell your story in the Story Room." | "Message me on Facebook, text or call 304-677-1113, or pick a time and I'll call you." |
| 14 | `index.html` line 454 | The same FAQ answer, copied into the structured data for Google | Same new wording (the two must match) |
| 15 | `script.js` lines 473–478 | Analytics rule for Story Room clicks | Delete; add the Messenger and callback rules above |
| 16 | `tests/seo.test.mjs` lines 111–125 | An automated check that **requires** the Story Room link to exist | Must be rewritten in the same change, or the test run fails |
| 17 | `CLAUDE.md`, `PRODUCT.md`, `.github/pull_request_template.md` | Project notes that describe the Story Room as the second path | Update so nobody restores it later |

Outside this repository, for a follow-up: the Jukebox has one Story Room link, and the Story Room page links back to the main site three times. Its fallback text also says "reach us… we'd love to hear from you" (breaks the first-person rule).

### First person singular — every line that breaks it

**"We" (hard violations)**
- Step 02 heading: **"We create together."** → "I write it. You approve it."
- Closing heading: **"Let's make it sing."** ("let us") → "Tell me who it's for."

**Tim in the third person** (he is the "I" everywhere else on the page)
- Buttons: "Text Tim" (header), "Text Tim about your song" (hero, price card, closing, pinned bar) → "Message me for a song"
- "Tim answers himself, usually same day." (price card, closing) → "I answer myself, usually the same day."
- "Email Tim" (price card, closing, footer) → "Email me"
- Step 01: "Share them with Tim by text, call or email…" → "Share them with me…"
- Step 02: "Tim writes the lyrics and produces your song." → "I write the lyrics and produce your song."
- Pricing: "Personally written by Tim Harbert." → "I write every song myself."
- Price list: "One-on-one creative consultation with Tim" → "…with me"
- Guarantee: "If the finished song misses the mark, Tim starts over from scratch." → "…I start over from scratch."
- FAQ "How does it work?": "Text Tim… Tim answers himself… Tim writes your lyrics, works with you…"
- FAQ "How fast…": "…Tim will confirm what's possible."
- FAQ "What if the finished song misses the mark?": "Tim starts over from scratch."
- All three FAQ answers are duplicated in the structured data and must change together.
- Nav: "Meet Tim" → "About me"
- Meta and share descriptions: "Heartstrings Studio writes and produces…" → "I write and produce…"
- `404.html`: "Text Tim about your song"

Customer quotes ("I would have him write…", "Tim took over…") are the customers' words. Leave them.

### Delivery promises
- **FAQ: "Most songs arrive in 48–72 hours."** "Most" contradicts "guaranteed". → "Every song is ready in 48–72 hours, guaranteed. Memorial songs are ready in 24 hours at no extra charge."
- **Nowhere on the page does the word "guaranteed" appear next to 48–72 hours** (hero, proof bar, Step 03, price list, meta description all say only "48–72 hours"). Add it.
- **"Rush delivery +$50"** (price card) sits with no memorial exception beside it. The memorial note is a screen higher on a phone. → "Rush delivery +$50 (never charged on memorial songs)".
- **Rush is never defined.** The page does not say what $50 buys. Because the 24-hour figure may only appear in memorial context, you need wording for non-memorial rush that does not use it. **Decision needed from you:** what does paid rush deliver?
- The 24-hour promise appears twice, both times in memorial context (pricing note, FAQ). **No violation.**

### Deliverables
- Listed correctly: custom album art, permanent keepsake page, MP3, MP4 share video.
- **Not in your facts list but promised on the page; confirm or cut:** "A lyric sheet download, ready to print", "One round of lyric revisions", "One-on-one creative consultation", and the remake guarantee.
- The MP4 is not described as arriving via Google Drive. Fine to leave unsaid.
- Step 03 says the keepsake page "arrives by email". If people book through Messenger, say "I send you your keepsake page".
- **YouTube is not presented as a deliverable anywhere.** No violation.

### Numbers and claims
- "115 stories turned into songs" is consistent with "100+". It is a number someone has to keep updating in two places. → "100+ songs".
- The Jukebox block says "30+ songs and counting" a screen below "115". A visitor will wonder which is true. Cut the block or say "30+ you can play right now".
- WBOY 304 Today: present, twice. Correct.
- $150 flat, +$100 commercial license, +$50 rush: all match.

### Forbidden words
- "AI-powered" or any mention of AI: **none.**
- Guitars: **none** in the copy, alt text or structured data, and none visible in the images I viewed.

---

## Prioritized action list

### QUICK WINS (under an hour each)

| # | What to change | Why | Impact |
|---|---|---|---|
| 1 | Claim a Facebook Page username and confirm `m.me/<username>` opens the Page inbox | Nothing else can ship without the link | **High** |
| 2 | Make the hero's main button **Message me for a song**; move "Hear a song" to a small play chip | The only big button on the first screen is not a booking button | **High** |
| 3 | Put **Message me** on the keepsake pages under the player ("I write songs like this for families. Message me →") | 270 of 303 sessions, 0 leads, one link at the very bottom | **High** |
| 4 | Swap the two `og:image` tags so the branded share card is first | Every Facebook share currently shows an image without your name | **High** |
| 5 | Move the proof line (100+ songs · WBOY · ★★★★★) directly under the hero buttons | Trust arrives at 2.3 screens today | **High** |
| 6 | Enlarge the studio name in the header; remove the second nav row on phones | Name is 14px; header eats 17% of the screen | **High** |
| 7 | Remove all 11 Story Room links and the 3 mentions (table in Step 9), including the test | Decided; also removes 9 dead-end pills | **Med** |
| 8 | Fix the copy violations in Step 9 (we/Tim, "Most songs", rush exception, "guaranteed") | Brand rules and one broken promise | **Med** |
| 9 | Make `generate_lead` the only key event; add `method` and `placement` | Conversions are counted twice and cannot be traced to a button | **Med** |
| 10 | Add UTM tags to every link you post (`?utm_source=facebook&utm_medium=social&utm_campaign=<song-or-post>`); set up an internal-traffic filter | You cannot tell posts apart, and TikTok does not show up at all | **Med** |
| 11 | Stop the review rotation; show all three quotes | Two of three testimonials are hidden from most visitors | **Med** |
| 12 | Remove the count-up animation; print "100+" | Mid-animation it shows a wrong number; removes upkeep | **Low** |
| 13 | Rename "Investment" to "Price" | Plain words | **Low** |
| 14 | Shrink the logo file to 96px; drop the unused font weight | 84 KB for a 40px image | **Low** |

### MEDIUM (half a day to two days)

| # | What to change | Why | Impact |
|---|---|---|---|
| 15 | Rebuild the hero as Concept A (name, promise, price, two buttons, real photo, fireflies) | Fixes all four 5-second grades | **High** |
| 16 | Two-button pinned bar (Message me / Call me back), slimmer, visible from first scroll, with page padding so it covers nothing | Keeps both actions one tap away for all 7 screens | **High** |
| 17 | Add the Book a callback section and buttons, linked to your Google Calendar appointment page | Decided; serves people who will not type | **High** |
| 18 | Add the memorial band high on the page | Largest, most urgent group; the 24-hour promise is your strongest offer | **High** |
| 19 | Merge Keepsake + Process + Pricing into one section; cut the porch statement, postcard, scroll cue and jukebox block on phones | 14 screens → about 7 | **High** |
| 20 | Cut the gallery to three songs by occasion + one Jukebox link | A 12-card sideways catalogue duplicates the Jukebox | **Med** |
| 21 | One serif for all headings; a 6-step type scale; 14px minimum | 60 font sizes and a stray third typeface | **Med** |
| 22 | Reduce motion to three effects; remove tilted text cards and the heavy 3D button edge | Reads calmer and more expensive | **Med** |
| 23 | Add play and click tracking to keepsake pages; fix `section_view` for tall sections; drop the duplicate scroll tracker | Your busiest pages are unmeasured | **Med** |
| 24 | Resize song covers and the porch image to what phones display; stop loading the hidden backdrop | About 740 KB saved on weak connections | **Low** |
| 25 | Rebuild the two heavy keepsakes (6.2 MB and 1.4 MB) so art and PDF are separate files | First paint on a rural signal | **Low** |

### BIG MOVES

| # | What to change | Why | Impact |
|---|---|---|---|
| 26 | Treat keepsake pages as the front door: a standard, gentle studio block on every one (name, one line, Message me, Book a callback), built into the keepsake builder | This is where the audience is. A better main page alone cannot move bookings while 89% of visitors never see it | **High** |
| 27 | A dedicated memorial page to link from memorial posts | A grieving visitor lands on a page about only them; the 24-hour promise leads | **High** |
| 28 | A real domain (get `heartstringswv.com` pointing at the site) | `heartstringsstudio.github.io/heartstringsstudio/` behind a tinyurl does not look like a premium studio; search traffic is 3 sessions | **Med** |
| 29 | Collect more testimonials with first name, town and occasion; add one short video reaction | Three quotes is thin for "100+ songs"; local names carry weight in word-of-mouth | **Med** |

**A note on #3 and #26.** The keepsake template carries a deliberate rule: one call to action, at the bottom. That restraint is right in spirit; these are families' pages. One quiet line under the player keeps the spirit and reaches the 61% who leave *Rest Now, Chief* without scrolling.

---

## Wireframe — recommended phone page, top to bottom

```
┌──────────────────────────────────────┐
│ ♥  HEARTSTRINGS STUDIO          ☎    │  slim header, one row, name readable
├──────────────────────────────────────┤
│                                      │
│   [ real photo of Tim, darkened,     │
│     a few fireflies drifting ]       │
│                                      │
│        Heartstrings Studio           │  largest text on the screen
│                                      │
│   I write custom songs from          │
│   your memories.                     │
│                                      │
│   $150 flat · 48–72 hours,           │
│   guaranteed                         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   Message me for a song        │  │  amber, primary → Messenger
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │   Book a callback              │  │  outlined, secondary → calendar
│  └────────────────────────────────┘  │
│   Or text me · call 304-677-1113     │  both tappable
│                                      │
│   ▶ Hear a song                      │  small chip, scrolls to player
│                                      │
│  100+ songs · WBOY 304 Today · ★★★★★ │  one-line proof
├──────────────────────────────────────┤  ← end of screen 1
│  THIS WEEK'S SONG                    │
│  Grandpa's Footlocker                │
│  ┌────────────────────────────────┐  │
│  │        [ album art  ▶ ]        │  │
│  └────────────────────────────────┘  │
│  One line about the song.            │
│                                      │
│  More to hear:                       │
│  ▶ Rest Now, Chief      · Memorial   │
│  ▶ You Still Walked Me Down · Wedding│
│  ▶ I Never Had To Ask   · Tribute    │
│  All songs in the jukebox →          │
├──────────────────────────────────────┤
│  Lost someone?                       │
│  Tell me about them. Memorial songs  │
│  are ready in 24 hours, and I never  │
│  charge a rush fee for one.          │
│  [ Message me ]                      │
│  Or text me · call 304-677-1113      │
├──────────────────────────────────────┤
│  ★★★★★ "My daughter cried, as well   │
│  as I did…"              — Jane H.   │
│  ★★★★★ "My song has brought so much  │
│  comfort…"            — Dolores B.   │
│  ★★★★★ "…a truly remarkable          │
│  tribute…"              — Susan H.   │
├──────────────────────────────────────┤
│  How it works                        │
│  1  Tell me who it's for.            │
│  2  I write it. You approve the      │
│     lyrics.                          │
│  3  Your song arrives in 48–72       │
│     hours, guaranteed.               │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  $150 flat                     │  │  flat card, not tilted
│  │  ✓ Your custom song            │  │
│  │  ✓ Custom album art            │  │
│  │  ✓ A permanent keepsake page   │  │
│  │  ✓ MP3 to keep                 │  │
│  │  ✓ MP4 video to share          │  │
│  │  If it misses the mark, I      │  │
│  │  start over.                   │  │
│  │  [ Message me for a song ]     │  │
│  │  Or text me · call 304-677-1113│  │
│  │  Commercial license +$100      │  │
│  │  Rush +$50 (never on memorials)│  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  Rather talk it through?             │
│  Pick a time and I'll call you.      │
│  Tell me who the song is for and     │
│  I'll ask the rest. No forms.        │
│  [ Pick a time for me to call ]      │
│  I call from 304-677-1113.           │
├──────────────────────────────────────┤
│  [ photo ]  Hey, I'm Tim.            │
│  Three sentences.                    │
│  ▶ Watch my story on WBOY's          │
│    304 Today                         │
├──────────────────────────────────────┤
│  Questions                        +  │
│  How fast will I get my song?     +  │
│  Can I approve the lyrics?        +  │
│  Can I give it as a gift?         +  │
│  How do I share it?               +  │
│  What if it misses the mark?      +  │
├──────────────────────────────────────┤
│  You already have the story.         │
│  [ Message me for a song ]           │
│  [ Book a callback ]                 │
│  Or text or call me: 304-677-1113    │
├──────────────────────────────────────┤
│  Heartstrings Studio · Lumberport WV │
│  Facebook · TikTok · YouTube ·       │
│  Jukebox · Email me                  │
└──────────────────────────────────────┘

  Pinned to the bottom of the screen from the first scroll:
┌──────────────────────────┬───────────┐
│  Message me              │ Call me   │
│                          │ back      │
└──────────────────────────┴───────────┘
```

---

## What I could not verify

- **Real-device behaviour.** Everything was tested in a desktop browser emulating a 390px iPhone. Nothing was tapped on an actual iPhone inside the Facebook app, which is where 57% of your users are.
- **Facebook, Messenger, YouTube and TikTok links**, and the YouTube players. Those hosts are blocked in the audit environment.
- **Live analytics events.** Google Analytics was blocked too, so tracking was verified by reading the code.
- **Search Console.** Not in the report; indexing status is unknown.
- **Which two people made the 3 lead actions,** and whether one was you.
