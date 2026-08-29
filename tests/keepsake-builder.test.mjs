import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const builder = fs.readFileSync(path.join(root, 'keepsake-builder.html'), 'utf8');
const scriptMatch = builder.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);

test('builder script parses', () => {
  assert.ok(scriptMatch, 'builder script should be extractable');
  assert.doesNotThrow(() => new vm.Script(scriptMatch[1]));
});

function loadBuilder() {
  const elements = new Map();
  const element = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        value: '',
        checked: false,
        textContent: '',
        innerHTML: '',
        files: [],
        classList: { add() {}, remove() {}, toggle() {} },
        addEventListener() {},
        scrollIntoView() {}
      });
    }
    return elements.get(id);
  };
  const sandbox = {
    console,
    Blob,
    URL,
    Uint8Array,
    Array,
    Math,
    Date,
    JSON,
    Object,
    RegExp,
    String,
    Boolean,
    btoa,
    crypto: webcrypto,
    navigator: {},
    document: {
      getElementById: element,
      createElement: () => ({ style: {}, click() {}, select() {} }),
      body: { appendChild() {}, removeChild() {} },
      execCommand: () => true
    },
    FileReader: class {},
    Image: class {},
    setTimeout() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  new vm.Script(scriptMatch[1]).runInContext(sandbox);
  return sandbox;
}

const keepsake = {
  title: 'A Song to Keep',
  dedication: 'For Rose',
  occasion: 'Memorial / Tribute',
  pageCode: 'k7h2m9q4x1',
  youtube: 'https://youtu.be/dQw4w9WgXcQ',
  art: 'data:image/webp;base64,AAAA',
  alt: 'Two hands holding a faded photograph.',
  storyOpen: 'This is where the story begins.',
  storyBody: 'A first paragraph.\n\nA second paragraph.',
  lyrics: 'First line\nSecond line',
  lyricsPdf: 'data:application/pdf;base64,AAAA',
  songMp3: 'data:audio/mpeg;base64,AAAA',
  footerMode: 'signature'
};

test('generated keepsake contains privacy, playback, and permanent downloads', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /G-TB4NQVQ8VZ/);
  assert.match(html, /<audio controls/);
  assert.match(html, /Download the song/);
  assert.match(html, /Download the lyric sheet/);
  assert.match(html, /Share this song/);
  assert.match(html, /occasion-memorial-tribute/);
  assert.match(html, /Made with <em>care\.<\/em>/);
  assert.doesNotMatch(html, /tinyurl\.com/);
  assert.doesNotMatch(html, />Start a song<\/a>/);
});

test('YouTube validation accepts genuine links and rejects lookalikes', () => {
  const app = loadBuilder();
  assert.equal(app.youTubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(app.youTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(app.youTubeId('https://example.com/watch?v=dQw4w9WgXcQ'), '');
  assert.equal(app.youTubeId('this text has dQw4w9WgXcQ inside'), '');
});

test('the share button hands out the ?share link, not the page in hand', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);
  const url = 'https://heartstringsstudio.github.io/keepsakes/k7h2m9q4x1/?share';

  assert.match(html, new RegExp(`data-share-url="${url.replace(/[?]/g, '\\?')}"`));
  // The link is also written out for anyone without scripts.
  assert.ok(html.includes(`value="${url}"`), 'plain link should carry the share url');
  // Sharing location.href would hand over the downloads with the page.
  assert.doesNotMatch(html, /navigator\.share\(\{ title: document\.title, url: location\.href \}\)/);

  assert.equal(app.keepsakeShareUrl('k7h2m9q4x1'),
    'https://heartstringsstudio.github.io/keepsakes/k7h2m9q4x1/?share');
  assert.equal(app.keepsakeShareUrl(''), '?share');
});

test('a shared link hides the downloads and the in-page player', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);

  // The marker is read in the head, before anything renders.
  assert.match(html, /className\+=" sharing"/);
  assert.match(html, /location\.search\+window\.location\.hash/);
  // ...and both media sections are hidden when it is set.
  assert.match(html, /html\.sharing section\[aria-labelledby="downloads-heading"\]/);
  assert.match(html, /html\.sharing section\[aria-labelledby="listen-heading"\]/);
  // The page says one thing to the client and another to the recipient.
  assert.match(html, /html\.sharing \.share-note-owner\{display:none\}/);
  assert.match(html, /without your keepsake downloads on it/);
  assert.match(html, /Pass the song and the story along/);

  // The keepsake itself is untouched: this hides, it does not remove.
  assert.match(html, /data:audio\/mpeg/);
  assert.match(html, /data:application\/pdf/);
});

test('a keepsake without scripts still renders instead of going blank', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);
  assert.match(html, /document\.documentElement\.className \+= " js"/);
  assert.match(html, /html\.js \.reveal \{ opacity: 0/);
  assert.doesNotMatch(html, /\n    \.reveal \{ opacity: 0/);
  // The head script must survive intact: the share handler has to land in
  // the body script, after the DOM exists, not in the head.
  assert.ok(html.indexOf('var shareBox') > html.indexOf('IntersectionObserver'),
    'share handler should come after the reveal script');
});

test('delivery is still a single file', () => {
  assert.ok(builder.includes("return 'keepsake-' + slugify(els.pageCode.value) + '.html';"),
    'the builder should still export one page per keepsake');
});

test('production controls remain present in the builder', () => {
  for (const token of ['id="pageCode"', 'id="songMp3"', 'id="lyricsPdf"', 'id="consent"', 'id="saveDraft"', 'optimizeArtwork']) {
    assert.ok(builder.includes(token), `missing ${token}`);
  }
});
