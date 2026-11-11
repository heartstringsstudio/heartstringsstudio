import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const ld = JSON.parse(
  html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
);
const SITE = 'https://heartstringsstudio.github.io/heartstringsstudio/';
const node = (type) =>
  ld['@graph'].find((n) => [].concat(n['@type']).includes(type));

/* The page builds its FAQ and songs from arrays in script.js,
   so the structured data in index.html has to be updated in the same pass.
   These tests fail loudly when the two drift apart. */
function jsPairs(name) {
  const body = js.match(new RegExp(`const ${name}=\\[([\\s\\S]*?)\\];`))[1];
  return [...body.matchAll(/\['([^']*)','([^']*)'\]/g)].map((m) => [m[1], m[2]]);
}

test('structured data is valid and complete', () => {
  assert.equal(ld['@context'], 'https://schema.org');
  for (const type of ['ProfessionalService', 'WebSite', 'Product', 'ItemList', 'FAQPage']) {
    assert.ok(node(type), `missing ${type} node`);
  }
});

test('FAQ structured data matches the FAQ the page renders', () => {
  const onPage = jsPairs('faq');
  const marked = node('FAQPage').mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
  assert.deepEqual(marked, onPage);
});

test('song structured data matches the songs the page renders', () => {
  /* The song cards are injected by script.js, so their titles and descriptions
     never reach the served HTML. The ItemList is the only thing a crawler can
     read — it has to carry every song, in order, with the same artwork the
     card shows. */
  const body = js.match(/const songs=\[([\s\S]*?)\];/)[1];
  const onPage = [...body.matchAll(/\['([^']*)','[^']*','[^']*','([^']*)','([^']*)'(?:,'([^']*)')?\]/g)]
    .map((m) => ({
      name: m[2],
      description: m[3],
      url: `https://www.youtube.com/watch?v=${m[1]}`,
      thumbnailUrl: m[4]
        ? `${SITE}${m[4]}`
        : `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
    }));

  const list = node('ItemList');
  assert.equal(list.numberOfItems, onPage.length);
  assert.deepEqual(
    list.itemListElement.map((e) => e.position),
    onPage.map((_, i) => i + 1),
    'songs should be listed in the order the page renders them'
  );
  assert.deepEqual(
    list.itemListElement.map((e) => ({
      name: e.item.name,
      description: e.item.description,
      url: e.item.url,
      thumbnailUrl: e.item.thumbnailUrl
    })),
    onPage
  );
  /* Every song is credited to the studio entity rather than a loose string. */
  for (const e of list.itemListElement) {
    assert.equal(e.item.byArtist['@id'], `${SITE}#business`);
  }
});

test('review markup matches the testimonials the page shows', () => {
  const visible = [...html.matchAll(/<blockquote>“(.*?)”<\/blockquote><figcaption>(.*?) <small>/g)]
    .map((m) => [m[2], m[1]]);
  const product = node('Product');
  const marked = product.review.map((r) => [r.author.name, r.reviewBody]);
  assert.deepEqual(marked, visible);
  assert.equal(product.aggregateRating.reviewCount, String(visible.length));
});

test('the Product offer points at the price card, where Message me lives', () => {
  // Offer.url names the pricing section, whose primary button is Message me.
  const offer = node('Product').offers;
  assert.equal(offer.url, 'https://heartstringsstudio.github.io/heartstringsstudio/#pricing');
  assert.ok(html.includes('id="pricing"'), 'the #pricing section must exist');
});

test('social and canonical metadata are present', () => {
  for (const tag of [
    'rel="canonical"',
    'property="og:title"',
    'property="og:image"',
    'name="twitter:card"',
  ]) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
});

test('analytics tag and its events are wired up', () => {
  assert.ok(html.includes("gtag('config', 'G-TB4NQVQ8VZ')"), 'GA4 config missing');
  for (const event of ['scroll_depth', 'section_view', 'cta_click', 'generate_lead', 'song_play', 'messenger_click', 'callback_click', 'sms_click', 'tel_click']) {
    assert.ok(js.includes(`'${event}'`), `missing ${event} event`);
  }
});

/* Commission CTAs are "Message me": Messenger to the studio's Facebook Page.
   Text and call sit beside every one as tappable links. The second action is
   "Book a callback", an outlined button to the Google Calendar appointment
   page. Nothing else on the page is a button; the jukebox is a text link. The
   Story Room is gone from this page (November 2026) and must not come back. */
test('commission CTAs open Messenger, with text, call and a callback beside them', () => {
  const MSG = 'https://m.me/61584734289007';
  const CAL = 'https://calendar.app.google/oDX7GcemevPmH2u1A';
  const ctas = [...html.matchAll(/<a class="button([^"]*)" href="([^"]+)"/g)].map((m) => ({ cls: m[1], href: m[2] }));
  const msg = ctas.filter((c) => c.href === MSG);
  const cal = ctas.filter((c) => c.href === CAL);
  const others = ctas.filter((c) => c.href !== MSG && c.href !== CAL).map((c) => c.href);
  assert.ok(msg.length >= 6, 'expected Message me in the header, hero, memorial band, price card, closing and pinned bar');
  assert.ok(msg.every((c) => !c.cls.includes('ghost')), 'Message me is always the solid button');
  assert.equal(cal.length, 4, 'expected Book a callback in the hero, its own section, closing and pinned bar');
  assert.ok(cal.every((c) => c.cls.includes('ghost')), 'the callback button is always the outlined one');
  assert.deepEqual(others, [], 'every button on the page is one of the two commission actions');
  assert.match(html, /<div class="mobile-cta" inert><a class="button" href="https:\/\/m\.me\/61584734289007">/, 'pinned phone bar must lead with Message me');
  assert.ok(html.includes('id="callback"'), 'the callback section must exist');
  /* Every Message me button in the page body is followed by the text and
     call links: hero, memorial band, price card, closing. */
  const reach = html.match(/<p class="reach-options">Or <a href="sms:\+13046771113">text me<\/a> · <a href="tel:\+13046771113">call 304-677-1113<\/a><\/p>/g) || [];
  assert.equal(reach.length, 4, 'text and call links belong under the hero, memorial band, price card and closing buttons');
  assert.ok(!/storyroom|Story Room/i.test(html + js), 'the Story Room was removed from this page');
  assert.ok(html.includes('href="mailto:heartstringsstudiowv@gmail.com"'), 'missing the email link');
  assert.ok(html.includes('id="weekly-song"'), 'listening target must exist');
});

/* One tap is one lead. cta_click used to fire beside generate_lead on every
   contact tap, which counted each conversion twice. */
test('contact taps send one conversion, with its placement', () => {
  const handler = js.slice(js.indexOf('Contact taps.'));
  assert.equal((handler.match(/'cta_click'/g) || []).length, 1, 'cta_click is for the jukebox only');
  assert.ok(handler.includes('method, placement'), 'generate_lead must carry method and placement');
});

/* Facebook uses the first og:image, and nearly all traffic is Facebook, so
   the card with the studio name on it has to lead. */
test('the branded share card is the first og:image', () => {
  const first = html.match(/<meta property="og:image" content="([^"]+)"/)[1];
  assert.ok(first.includes('assets/share-card.jpg'), `first og:image is ${first}`);
});

/* Business rules for the copy: first person, a guaranteed window, and no
   rush price without the memorial exception. */
test('copy keeps the business rules', () => {
  const visible = html.slice(html.indexOf('<body>')) + js.match(/const faq=\[[\s\S]*?\];/)[0];
  for (const phrase of ['Text Tim', 'Email Tim', 'Tim answers', 'Tim writes', 'Tim starts', 'Tim will', 'with Tim', 'We create', 'Most songs']) {
    assert.ok(!visible.includes(phrase), `"${phrase}" breaks the first-person / guarantee rules`);
  }
  assert.ok(visible.includes('48–72 hours, guaranteed'));
  assert.ok(html.includes('Rush is never charged on memorial songs.'));
});

test('structured data carries the public phone number', () => {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const nodes = ld.flatMap((d) => d['@graph'] || [d]);
  const business = nodes.find((n) => n['@id'] && n['@id'].endsWith('#business'));
  assert.equal(business.telephone, '+1-304-677-1113');
});

test('no inline order form on the page', () => {
  assert.ok(!/<form[\s>]/.test(html), 'index.html should not contain a form');
});

/* The song cards are in-page players (the Jukebox pattern), so nothing in the
   listen section links out to youtube.com and no iframe is built until a
   visitor presses play. */
test('song cards play in place instead of linking out to YouTube', () => {
  /* Three songs are shown; the rest sit in the More songs drawer, so every
     entry in the ItemList is still on the page. */
  assert.ok(html.includes('id="songs"') && html.includes('id="songs-more"'), 'gallery and drawer mounts must exist');
  for (const id of js.match(/const featured=\[([^\]]*)\]/)[1].match(/[\w-]{11}/g)) {
    assert.ok(js.includes(`['${id}',`), `featured song ${id} is not in the songs array`);
  }
  assert.ok(!/youtube\.com\/watch/.test(js), 'song cards should not link out to youtube.com');
  assert.ok(js.includes('youtube-nocookie.com/embed/'), 'missing the nocookie player');
  assert.ok(!/<iframe/.test(html), 'index.html should ship no iframe');
  assert.ok(js.includes("classList.add('is-playing')"), 'missing the playing state');
});

/* The WBOY segment plays in the same player, in a lightbox — but its anchors
   stay real youtube.com links so scripts-off and ctrl-click still work. */
test('the WBOY links open the in-page player', () => {
  const links = [...html.matchAll(/<a[^>]*href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)"[^>]*>/g)];
  assert.ok(links.length >= 2, 'expected the WBOY links to stay real YouTube links');
  for (const [tag, id] of links) {
    assert.ok(tag.includes(`data-video="${id}"`), `WBOY link missing its data-video hook: ${tag}`);
  }
  assert.ok(js.includes("querySelectorAll('a[data-video]')"), 'script.js never upgrades the WBOY links');
  assert.ok(js.includes('showModal'), 'missing the lightbox player');
});

/* The page is ordered for someone deciding in seconds on a phone: a song to
   hear, a few more, the memorial promise, what clients said, then how it
   works and the price in one section. Keep the songs and the price from
   drifting back down the page. */
test('songs, the memorial band and reviews come before the price', () => {
  const weekly = html.indexOf('id="weekly-song"');
  const gallery = html.indexOf('id="listen"');
  const memorial = html.indexOf('id="memorial"');
  const reaction = html.indexOf('class="featured-reaction wrap"');
  const offer = html.indexOf('id="process"');
  const price = html.indexOf('id="pricing"');
  const callback = html.indexOf('id="callback"');
  assert.ok(weekly > 0 && weekly < gallery && gallery < memorial && memorial < reaction && reaction < offer && offer < price && price < callback);
  /* The 24-hour promise lives in memorial context only. */
  const band = html.slice(memorial, html.indexOf('</section>', memorial));
  assert.ok(band.includes('24 hours'));
  const visible = html.slice(html.indexOf('<body>'));
  assert.equal((visible.match(/24[- ]hours?/g) || []).length, 1, 'the 24-hour figure belongs in the memorial band only');
  assert.ok(html.includes('id="weekly-player"'), 'weekly player mount missing');
  const testimony = html.slice(reaction, html.indexOf('</section>', reaction));
  assert.ok(testimony.includes('Jane H.'));
  assert.ok(testimony.includes('HEARTSTRINGS CLIENT'));
  /* All three reviews are shown together in this one spot. */
  for (const name of ['Jane H.', 'Dolores B.', 'Susan H.']) {
    assert.ok(testimony.includes(name), `${name} should be in the reviews`);
  }
  /* Read the weekly title out of script.js so this guard keeps biting after
     the song is swapped, instead of quietly checking last week's title. */
  const weeklyTitle = js.match(/const songs=\[\['[^']*','[^']*','[^']*','([^']*)'/)[1];
  assert.ok(!testimony.includes(weeklyTitle), 'do not imply Jane reviewed the featured song');
});
