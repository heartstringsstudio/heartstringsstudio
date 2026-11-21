import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const promo = read('promo.js');
const home = read('index.html');
const mem = read('memorial/index.html');

/* Black Friday and holiday 2026 pricing, set by the owner on 21 Nov 2026:
   $99 on Black Friday only (first 25 songs, in the order received), $125
   from the Saturday after through December 20, then back to $150. */
test('the sale runs on the dates the owner set', () => {
  assert.match(promo, /const BLACK_FRIDAY = '2026-11-27'/);
  assert.match(promo, /id: 'blackfriday', from: BLACK_FRIDAY, to: BLACK_FRIDAY/);
  assert.match(promo, /id: 'holiday', from: '2026-11-28', to: '2026-12-20'/);
  assert.match(promo, /timeZone: 'America\/New_York'/);
  assert.match(promo, /First 25 songs/);
});

test('the served pages keep the regular price and load the schedule first', () => {
  assert.ok(home.includes('<aside class="promo" id="promo" aria-label="Holiday pricing" hidden></aside>'), 'the ribbon ships hidden');
  assert.ok(home.indexOf('promo.js') < home.indexOf('script.js?v='), 'promo.js must run before script.js builds the FAQ');
  assert.ok(mem.indexOf('promo.js') < mem.indexOf('memorial.js'));
  assert.ok(home.includes('$150 <small>flat</small>'));
  assert.ok(mem.includes('$150 flat'));
});

test('Black Friday copy never promises the 48–72 hour window', () => {
  const bf = [...promo.matchAll(/blackfriday: [`'](.*?)[`'],?\n/g)].map((m) => m[1]);
  assert.ok(bf.length >= 5);
  for (const line of bf) {
    assert.ok(!/48–72 hours?, guaranteed|Ready in 48/.test(line), `Black Friday line promises the window: ${line}`);
  }
  assert.ok(promo.includes('the 48–72 hour guarantee doesn’t apply to them'));
  assert.ok(promo.includes('Rush delivery isn’t available on Black Friday orders.'));
  assert.ok(promo.includes('don’t count toward the 25'));
  /* Once the 25 are taken, $125 starts early for the rest of Friday. */
  assert.match(promo, /const SOLD_OUT = false;/);
  assert.ok(promo.includes("phase === 'soldout' && !('soldout' in set) ? set.holiday"));
});

test('sale copy keeps the 24-hour and memorial rules', () => {
  const homeCopy = promo.slice(promo.indexOf('const RIBBON'), promo.indexOf('/* Memorial page'));
  assert.ok(!/24[- ]hours?/.test(homeCopy), 'the 24-hour figure belongs to the memorial band and rush add-on');
  const memCopy = promo.slice(promo.indexOf('/* Memorial page'), promo.indexOf('const ribbon'));
  assert.ok(!/48–72|\$50|Black Friday/.test(memCopy.replace(/\/\*[\s\S]*?\*\//g, '')), 'the memorial page stays quiet');
});
