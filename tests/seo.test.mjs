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
const node = (type) =>
  ld['@graph'].find((n) => [].concat(n['@type']).includes(type));

/* The page builds its FAQ, songs and occasion pills from arrays in script.js,
   so the structured data in index.html has to be updated in the same pass.
   These tests fail loudly when the two drift apart. */
function jsPairs(name) {
  const body = js.match(new RegExp(`const ${name}=\\[([\\s\\S]*?)\\];`))[1];
  return [...body.matchAll(/\['([^']*)','([^']*)'\]/g)].map((m) => [m[1], m[2]]);
}

test('structured data is valid and complete', () => {
  assert.equal(ld['@context'], 'https://schema.org');
  for (const type of ['ProfessionalService', 'WebSite', 'Product', 'FAQPage']) {
    assert.ok(node(type), `missing ${type} node`);
  }
});

test('FAQ structured data matches the FAQ the page renders', () => {
  const onPage = jsPairs('faq');
  const marked = node('FAQPage').mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
  assert.deepEqual(marked, onPage);
});

test('review markup matches the testimonials the page shows', () => {
  const visible = [...html.matchAll(/<blockquote>“(.*?)”<\/blockquote><figcaption>(.*?) <small>/g)]
    .map((m) => [m[2], m[1]]);
  const product = node('Product');
  const marked = product.review.map((r) => [r.author.name, r.reviewBody]);
  assert.deepEqual(marked, visible);
  assert.equal(product.aggregateRating.reviewCount, String(visible.length));
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
  for (const event of ['scroll_depth', 'section_view', 'cta_click', 'generate_lead', 'song_play']) {
    assert.ok(js.includes(`'${event}'`), `missing ${event} event`);
  }
});

/* Commission CTAs go to the Story Room. The hero's listening CTA is the
   intentional exception: it takes visitors to the on-page weekly player. */
test('commission CTAs and the weekly listening CTA have the correct destinations', () => {
  const ctas = [...html.matchAll(/<a class="button[^"]*" href="([^"]+)"/g)].map((m) => m[1]);
  const commission = ctas.filter(href => href === 'https://heartstringsstudio.github.io/storyroom/');
  const listening = ctas.filter(href => href !== 'https://heartstringsstudio.github.io/storyroom/');
  assert.ok(commission.length >= 3, 'expected at least three commission CTAs');
  assert.deepEqual(listening, ['#weekly-song'], 'only the weekly listening CTA may target an on-page section');
  assert.ok(html.includes('id="weekly-song"'), 'listening CTA target must exist');
  assert.equal(js.match(/const base='([^']+)'/)[1], 'https://heartstringsstudio.github.io/storyroom/');
});

test('no inline order form on the page', () => {
  assert.ok(!/<form[\s>]/.test(html), 'index.html should not contain a form');
});

/* The song cards are in-page players (the Jukebox pattern), so nothing in the
   listen section links out to youtube.com and no iframe is built until a
   visitor presses play. */
test('song cards play in place instead of linking out to YouTube', () => {
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

/* The weekly feature and a real client reaction must precede the long scene
   and gallery, so the musical payoff is no longer buried below them. */
test('the weekly player and attributed reaction lead the scroll journey', () => {
  const weekly = html.indexOf('id="weekly-song"');
  const reaction = html.indexOf('class="featured-reaction wrap"');
  const gallery = html.indexOf('id="listen"');
  const porch = html.indexOf('id="heart"');
  assert.ok(weekly > 0 && weekly < reaction && reaction < gallery && gallery < porch);
  assert.ok(html.includes('id="weekly-player"'), 'weekly player mount missing');
  const testimony = html.slice(reaction, html.indexOf('</section>', reaction));
  assert.ok(testimony.includes('Jane H.'));
  assert.ok(testimony.includes('HEARTSTRINGS CLIENT'));
  assert.ok(!testimony.includes('Before the Doors Open'), 'do not imply Jane reviewed the featured song');
});
