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

test('generated keepsake contains privacy, playback, and permanent downloads', () => {
  const app = loadBuilder();
  const html = app.buildPage({
    title: 'A Song to Keep',
    dedication: 'For Rose',
    occasion: 'Memorial / Tribute',
    youtube: 'https://youtu.be/dQw4w9WgXcQ',
    art: 'data:image/webp;base64,AAAA',
    alt: 'Two hands holding a faded photograph.',
    storyOpen: 'This is where the story begins.',
    storyBody: 'A first paragraph.\n\nA second paragraph.',
    lyrics: 'First line\nSecond line',
    lyricsPdf: 'data:application/pdf;base64,AAAA',
    songMp3: 'data:audio/mpeg;base64,AAAA',
    footerMode: 'signature'
  });
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /G-TB4NQVQ8VZ/);
  assert.match(html, /<audio controls/);
  assert.match(html, /Download the song/);
  assert.match(html, /Download the lyric sheet/);
  assert.match(html, /Share or copy this page/);
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

test('production controls remain present in the builder', () => {
  for (const token of ['id="pageCode"', 'id="songMp3"', 'id="lyricsPdf"', 'id="consent"', 'id="saveDraft"', 'optimizeArtwork']) {
    assert.ok(builder.includes(token), `missing ${token}`);
  }
});
