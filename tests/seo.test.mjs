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

test('analytics tag and its four events are wired up', () => {
  assert.ok(html.includes("gtag('config', 'G-TB4NQVQ8VZ')"), 'GA4 config missing');
  for (const event of ['scroll_depth', 'section_view', 'cta_click', 'generate_lead']) {
    assert.ok(js.includes(`'${event}'`), `missing ${event} event`);
  }
});

/* Brand rules from CLAUDE.md: every song CTA goes to the Story Room, and the
   inline order form stays gone. */
test('every song CTA points at the story room', () => {
  const ctas = [...html.matchAll(/<a class="button[^"]*" href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ctas.length >= 3, 'expected at least three primary CTAs');
  for (const href of ctas) {
    assert.equal(href, 'https://heartstringsstudio.github.io/storyroom/');
  }
  assert.equal(js.match(/const base='([^']+)'/)[1], 'https://heartstringsstudio.github.io/storyroom/');
});

test('no inline order form on the page', () => {
  assert.ok(!/<form[\s>]/.test(html), 'index.html should not contain a form');
});
