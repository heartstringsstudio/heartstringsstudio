# Heartstrings Studio — Appearance & Impact Audit

*Audited July 2026 against the live homepage source (this repo, deployed at
`heartstringsstudio.github.io/heartstringsstudio/`), rendered and screenshotted at
1440px desktop and 390px mobile widths.*

**Scope notes:** The external intake page (`/intake/`) could not be fetched from the
audit environment (network policy), so the conversion path is audited up to the
hand-off click. `keepsake-builder.html` is a private studio tool and
`sheleftusaparty.html` is an unfinished, noindexed template — neither is in a
visitor's path, so they're covered only where relevant.

---

## 1. First-impression read (5 seconds)

A stranger lands on a dark, candle-lit page with a big serif headline — **"Your Story
Deserves a Song"** — over a rose-red button. Within five seconds they correctly
understand: *custom songs written from my memories, made by a small studio in West
Virginia.* Category clarity is genuinely good; nobody will mistake this for a band
page or a streaming service.

Would they trust it with a memorial song? **Mostly — but on the site's word alone.**
The page is polished enough to feel legitimate, but the first two screens contain no
human being: you meet a logo, a headline, and then a wall of statistics. The thing
that actually closes trust for a grief purchase — Tim's warm, real face and the fact
that one named person writes every song — is nine screens down. Until then the
dark-luxe styling reads slightly more "boutique wedding brand" than "neighbor in
Lumberport you'd hand your mother's story to."

One more first-impression snag: the hero "logo" is the full cream Facebook-style
banner image dropped onto the near-black background. It has hard rectangle edges, its
own baked-in tagline, and it repeats the brand name that's already in the nav — it
reads as *uploaded*, not *designed*, and it's the first thing the eye lands on.

---

## 2. Top 5 highest-impact improvements (ranked)

### 1. Put Tim's face near the top — *quick/medium*
**What's wrong:** The single strongest trust signal on the whole site (the
`timphoto.jpg` portrait — genuinely warm, great smile, studio behind him) doesn't
appear until roughly 75% of the way down a ~12,000px page. Memorial and wedding
buyers are deciding whether to trust a stranger with something raw; they need a
person, not a stat wall.
**Fix:** Add a compact human beat directly after the proof banner (or even inside
the hero): Tim's photo, small, with one line — *"Every song is written personally by
Tim Harbert in Lumberport, West Virginia."* Keep the full "Meet Tim" section where it
is. This is a cut-down duplicate, not a move.
**Effort:** quick (one small section, existing photo and copy).

### 2. Replace the banner image in the hero with a real logo lockup — *quick*
**What's wrong:** `banner.jpeg` is a light-cream rectangle pasted on a near-black
hero. It duplicates the brand name (already in the sticky nav) and adds a third
version of the same message in one screen: the banner's baked-in tagline ("Your
story, turned into a song you'll never forget"), the H1 ("Your Story Deserves a
Song"), and the hero tagline ("We turn meaningful moments into music…"). It also
crowds the hero and pushes the CTA down.
**Fix:** Use the transparent `logo.png` heart mark (tinted to suit the dark
background) plus "Heartstrings Studio" set in the page's own Cormorant type — the
sticky-nav logo treatment, scaled up, is already the right look. Drop the in-image
tagline entirely; the H1 does that job better. Bonus: this hides the brand
inconsistency where the banner/logo use a waveform-heart while Tim's shirt in the
photo shows a treble-clef heart.
**Effort:** quick.

### 3. Delete the standalone "What's Included" section — *quick*
**What's wrong:** The same ten bullets (consultation, custom song, revisions, MP3,
MP4, album art, lyric sheet, YouTube link, delivery window, remake guarantee) appear
**twice, verbatim, about one screen apart** — once as the "What's Included" section
and again inside the pricing card. On a page that's already 12 sections and 8
ornamental dividers long, this is the cheapest full screen you can cut, and the
pricing card is the better home (the list sits next to the price and the CTA).
**Fix:** Remove the "What's Included" section; keep the pricing card list. The
start-strip's "See everything included →" link already points at `#pricing`.
**Effort:** quick.

### 4. Remove 24-hour language from the homepage (brand rule) — *quick*
**What's wrong:** The stated brand rule is *no "24-hour turnaround" language except
on memorial/funeral pages* — and the homepage currently has it in three places:
- Proof banner stat: "48–72h · **24h for memorials**"
- Pricing card note: "**Rush delivery (24-hour guarantee)** available for an additional $50"
- FAQ "How fast will I get my song?": "…guaranteed within **24 hours**…"
(plus the same rush copy in the FAQ structured data in `<head>`).
**Fix:** Trim the proof stat to "48–72h · Delivered fast", and cut the rush sentence
from the pricing note and FAQ (keep "Commercial licensing available for $100"). When
a dedicated memorial page exists, the 24-hour promise lives there.
**Effort:** quick.

### 5. Trim the mobile stat stack and rethink the lead stat — *quick*
**What's wrong:** On a phone, the five proof stats stack vertically into ~2.5 screens
of numbers before the visitor hears a note of music. And the **lead** stat is
"20,119 views on a single tribute song" — a virality metric. For someone shopping a
memorial song, "how many people watched" is the wrong first proof; "107 songs
delivered" and "5-star rated" are the right ones. (Also, the counters render as "0"
for a beat before animating — the first paint of your proof section is a row of
zeros.)
**Fix:** Lead with "107 Songs delivered", then "48–72h", then "★★★★★". Fold the
20,119 number into the quote line below ("…one tribute song has been shared over
20,000 times") where it reads as resonance instead of reach. On mobile, keep stats to
one compact row of three.
**Effort:** quick.

---

## 3. Visual / design notes

**Typography.** Cormorant Garamond + Lato is a handsome, appropriate pairing, and the
hierarchy (tiny letterspaced label → big serif H2 → body) is applied consistently in
every section — this is the most professional thing about the page. One caution:
italics are doing too many jobs (buttons, taglines, captions, quotes, pull-lines are
*all* italic serif), so emphasis has stopped emphasizing. Pick two roles for italics
(quotes and taglines) and let buttons stand upright.

**Color.** The charcoal/rose/cream palette is distinctive and consistently applied.
But several small-text moments fall to very low contrast on the dark sections —
`hero-sub` at 42% opacity, `pricing-note` at 38%, `proof-label` at 52%, all at
11–12.5px. These are exactly the lines older memorial-audience visitors squint at
(the rush/licensing note, the email address). Raise these to ~70% opacity minimum.

**Section rhythm.** The page alternates dark-block / cream-block eight-plus times
with an ornamental diamond divider between nearly every pair. Each divider is lovely;
eight of them is wallpaper. Cutting half the dividers (keep them at the big
transitions: after hero-cluster, before pricing, before the close) plus cutting the
duplicate section (fix #3) would make the same content feel a screen and a half
shorter.

**Imagery.** The whole site contains three images: banner, logo, Tim. There is no
visual Appalachia anywhere on the homepage — meanwhile the keepsake template already
has a quiet ridgeline SVG divider that's exactly the right sensibility. Borrowing
that ridgeline motif onto the homepage (as a section divider or footer detail) would
add place without adding a single photo. Do **not** add stock imagery.

**Cross-page consistency.** The keepsake page (`sheleftusaparty.html`) is a
different brand: paper/green-ink/brass palette, Fraunces/Newsreader fonts, versus the
homepage's charcoal/rose, Cormorant/Lato. As a "letterpress keepsake" it's
defensible, but a client who clicks from their keepsake back to the site will feel
the seam. Its footer CTA also routes through `tinyurl.com/heartstringswv` to the
*homepage* instead of linking `/intake/` directly. And it still contains placeholder
content ("[the moment]", `YOUTUBE_ID`) — it's noindexed, so no harm, but don't share
that URL until it's filled in.

**A lurking layout hack.** `body { margin: -16px -24px -24px -24px; }` makes the
page render 48px wider than every viewport (verified at both 1440px and 390px);
`overflow-x: hidden` on `html` is masking it. It happens to look fine today, but it's
the kind of thing that breaks subtly on the next browser update or embed context.
Worth deleting the negative margins and re-checking — visual effort: none; risk
removed: real.

**Small mobile nit.** Left-aligned section labels ("Featured Stories in Song",
"Words From Clients") have their decorative left dash clipped off the screen edge on
mobile, leaving an unbalanced trailing dash on the right.

---

## 4. Emotional-impact notes

**Where it's genuinely warm — and it often is:**
- "A photo shows the moment. A song *brings you back* into it." — best line on the site.
- "The people who lived the songs" as a testimonial header.
- "Some moments deserve more than a *snapshot*."
- The testimonials themselves, especially Chrissy H.: *"I don't cry... but you just
  had me bawling like a baby."* That's plainspoken Appalachian warmth in a client's
  own voice — no copywriter could fake it.
- Tim's bio: "Music carried me through some dark chapters" is honest and lands.

**Where the tone breaks (transactional/hype creeping in):**
- **"Fresh from the studio — *just dropped*"** with a pulsing red LIVE-style badge
  and an animated equalizer. This is music-promo-channel energy on a page whose core
  buyer may be planning a funeral. Keep the weekly song — it's great proof — but
  retitle it in the site's own voice ("This week's song" / "Written this week for a
  family in ___") and drop the pulse animation.
- **"Investment"** as the pricing section label. That's financial-advisor speak.
  "The price" or "One flat price" is the plainspoken version — the section's own H2
  ("One song. One price. One story.") already nails it.
- **The proof-banner quote** — "When a song captures what words can't hold, people
  *share* it" — frames the product as shareable content. The Dolores B. testimonial
  ("My song has brought so much comfort to me…") is the emotional truth of the
  product; a line in that spirit belongs there instead.
- **Voice wobble:** the hero and proof copy say "We," the process step says "We
  Create Together," but the whole trust story is *one man named Tim*. A solo
  operator's "we" reads as either padding or a hidden team. Go first person
  ("I'll turn meaningful moments into music") or third ("Tim turns…") — everywhere.
- There is warmth and compassion throughout, but essentially **no dry humor**
  anywhere — the "Just Because" pill is the only wink on the page. One dry,
  human line (the FAQ is the natural home for it) would do more for the Appalachian
  sensibility than any design change.

---

## 5. Conversion path

**This is the strongest part of the site.** From any scroll position there is a route
to the intake form:

- Sticky nav "Begin Your Song →" — visible from first paint, desktop and mobile.
- Hero CTA above the fold at both 1440px and 390px.
- Weekly-song CTA, early "start strip" (with the price stated — good), pricing-card
  CTA, closing CTA — six intake links total, all consistently worded, all tracked
  (`cta_click` / `generate_lead`).
- Nine occasion pills that deep-link `/intake/?occasion=…` so the form arrives
  pre-filled — genuinely nice touch.

A motivated visitor can go from landing to the form in **one click, zero scrolling**.
The page never asks for anything before the form does.

Two leaks worth plugging:
1. **The hero sends people to YouTube.** Two of the three links in the hero ("browse
   the full catalog on YouTube", "Hear this week's song ↓") route attention away from
   the page or down past the pitch — before the visitor has heard the pitch. The
   Listen section already has a big YouTube button; demote the hero to one primary
   CTA plus the "Hear this week's song ↓" anchor at most.
2. **The hand-off itself is unverifiable from here** — the intake page is served from
   a separate source, and if its look diverges from the homepage the visitor feels a
   seam at the exact moment of highest commitment. Worth a manual check that
   `/intake/` uses the same rose/charcoal/Cormorant language as the button the
   visitor just clicked.

One placement tweak: the **remake guarantee** is the answer to the real objection
("$150 sight unseen?") but it's buried as the tenth bullet. One quiet line under the
pricing CTA — "If the finished song misses the mark, Tim starts over from scratch." —
puts the safety net where the hesitation happens.

---

## 6. One thing to leave alone

**The testimonial carousel.** The four quotes are specific, verifiably human, in real
people's voices, and they cover the exact emotional range of the product — the easy
process (Susan), the lasting comfort (Dolores), the room-full-of-tears gift moment
(Jane), and the plainspoken gut-punch (Chrissy). The white-card-on-cream design with
the oversized quote mark is clean and calm. Don't redesign it, don't rewrite them,
don't add stars-schema widgets around it. It is already doing precisely what the
whole site is trying to do.
