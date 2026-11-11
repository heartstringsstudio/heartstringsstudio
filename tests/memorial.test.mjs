import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('memorial/index.html');
const js = read('memorial/memorial.js');
const home = read('index.html');
const body = html.slice(html.indexOf('<body'));
const MSG = 'https://m.me/61584734289007';
const CAL = 'https://calendar.app.google/oDX7GcemevPmH2u1A';

/* The memorial page is where memorial posts should point: one short page that
   speaks only to a grieving family. It follows the main page's rules. */

test('the memorial page follows the commission path', () => {
  const buttons = [...body.matchAll(/<a class="button([^"]*)" href="([^"]+)"/g)].map((m) => ({ cls: m[1], href: m[2] }));
  const msg = buttons.filter((b) => b.href === MSG);
  const cal = buttons.filter((b) => b.href === CAL);
  assert.equal(msg.length, 2, 'Message me at the top and at the end');
  assert.ok(msg.every((b) => !b.cls.includes('ghost')));
  assert.equal(cal.length, 2, 'Book a callback at the top and at the end');
  assert.ok(cal.every((b) => b.cls.includes('ghost')));
  assert.equal(buttons.length, 4, 'no other buttons');
  const reach = body.match(/<p class="reach-options">Or <a href="sms:\+13046771113">text me<\/a> · <a href="tel:\+13046771113">call 304-677-1113<\/a><\/p>/g) || [];
  assert.equal(reach.length, 2, 'text and call under both Message me buttons');
  assert.ok(!/storyroom|Story Room/i.test(html + js));
  assert.ok(!/<form[\s>]/.test(html));
  /* No pinned bar here: the page is short and the tone is quiet. */
  assert.ok(!body.includes('mobile-cta'));
});

test('the memorial promise is stated, and rush is never priced here', () => {
  assert.ok(body.includes('Ready in 24 hours'));
  assert.ok(body.includes('$150 flat'));
  assert.ok(body.includes('Never a rush fee'));
  assert.ok(body.includes('I never charge a rush fee for one'));
  assert.ok(!/\+\$50|\$50/.test(body), 'a memorial page must not price rush');
  assert.ok(!/48–72/.test(body), 'the 48–72 hour window is for other songs');
});

test('the memorial page speaks in the first person', () => {
  const visible = body
    .replace(/<blockquote>[\s\S]*?<\/blockquote>/g, ' ')
    .replace(/<div class="card-body">[\s\S]*?<\/div>/g, ' ') // song titles and blurbs are the songs' own words
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(visible, /\b(we|us|our|ours|we're|we've)\b/i);
  assert.doesNotMatch(visible, /\bTim\b/);
  assert.doesNotMatch(html, /\bAI\b|guitar/i);
});

test('the song cards are real links that play in place', () => {
  const cards = [...body.matchAll(/<a class="song-image thumb-btn" href="https:\/\/youtu\.be\/([\w-]{11})"[^>]*data-video="([\w-]{11})"/g)];
  assert.equal(cards.length, 3);
  for (const [, href, data] of cards) assert.equal(href, data);
  /* Every song shown here is one the main page lists too. */
  const main = read('script.js');
  for (const [, id] of cards) assert.ok(main.includes(`['${id}',`), `${id} is not in the main songs array`);
  assert.ok(js.includes('youtube-nocookie.com/embed/'));
  assert.ok(!/<iframe/.test(html), 'no iframe until someone presses play');
  for (const img of body.matchAll(/<img src="\.\.\/(assets\/[^"?]+)/g)) {
    assert.ok(fs.existsSync(path.join(root, img[1])), `${img[1]} is missing`);
  }
});

test('the memorial page shares the stylesheet version, analytics and metadata', () => {
  const version = home.match(/href="style\.css\?v=([^"]+)"/)[1];
  assert.ok(html.includes(`href="../style.css?v=${version}"`), 'memorial/index.html must carry the same style.css ?v= as index.html');
  assert.ok(html.includes("gtag('config', 'G-TB4NQVQ8VZ')"));
  for (const event of ['generate_lead', 'messenger_click', 'callback_click', 'sms_click', 'tel_click', 'song_play']) {
    assert.ok(js.includes(`'${event}'`), `missing ${event}`);
  }
  assert.ok(html.includes('<link rel="canonical" href="https://heartstringsstudio.github.io/heartstringsstudio/memorial/">'));
  assert.match(html, /<meta property="og:image" content="[^"]*assets\/share-card\.jpg/);
  assert.ok(read('sitemap.xml').includes('https://heartstringsstudio.github.io/heartstringsstudio/memorial/'));
  /* The main page's memorial band leads here. */
  assert.match(home, /<a class="text-link" href="memorial\/">More about memorial songs/);
});
