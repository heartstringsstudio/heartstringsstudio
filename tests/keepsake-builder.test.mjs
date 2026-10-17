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
  songMp3: 'data:audio/mpeg;base64,AAAA'
};

test('generated keepsake contains privacy, playback, and permanent downloads', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /G-TB4NQVQ8VZ/);
  assert.match(html, /<audio id="song-audio" controls preload="metadata"/);
  assert.match(html, /Download your song/);
  assert.match(html, /Download the lyric sheet/);
  assert.match(html, /Share this song/);
  assert.match(html, /occasion-memorial-tribute/);
  assert.doesNotMatch(html, /tinyurl\.com/);
  // One quiet link home, always: for another song, or a shared copy in a new pair of hands.
  assert.equal((html.match(/class="cta"/g) || []).length, 1);
  assert.match(html, /<a class="cta" href="https:\/\/heartstringsstudio\.github\.io\/heartstringsstudio\/">Visit Heartstrings Studio/);
  // A light signature, not a dark band.
  assert.doesNotMatch(html, /\.site-footer \{[^}]*charcoal/);
});

test('a shared keepsake link carries the album art as its share card', () => {
  const app = loadBuilder();
  const html = app.buildPage(Object.assign({}, keepsake, { publish: true, artSize: 1600 }));

  /* art.jpg sits beside the page at a public address, so the share card is
     the album art itself. A data: URI would silently produce a blank card. */
  const art = 'https://heartstringsstudio.github.io/keepsakes/k7h2m9q4x1/art.jpg';
  assert.ok(html.includes(`<meta property="og:image" content="${art}" />`));
  assert.ok(html.includes(`<meta name="twitter:image" content="${art}" />`));
  assert.match(html, /<meta property="og:image:width" content="1600" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.doesNotMatch(html, /<meta property="og:image" content="data:/);
  // The share card no longer leans on YouTube.
  assert.doesNotMatch(html, /i\.ytimg\.com/);

  // With no art chosen yet, the studio banner stands in — and is labelled as such.
  const noArt = app.buildPage(Object.assign({}, keepsake, { art: '' }));
  assert.match(noArt, /<meta property="og:image" content="[^"]*\/banner\.jpeg" \/>/);
});

test('the published page plays song.mp3 and shows art.jpg from its own folder', () => {
  const app = loadBuilder();
  const html = app.buildPage(Object.assign({}, keepsake, { publish: true }));

  assert.match(html, /<img class="album-art" src="art\.jpg"/);
  assert.match(html, /<audio id="song-audio" controls preload="metadata" src="song\.mp3">/);
  assert.match(html, /<a class="song-download" href="song\.mp3" download="A Song to Keep - Heartstrings Studio\.mp3">Download your song<\/a>/);
  // Nothing heavy rides inside the page any more except the small lyric sheet.
  assert.doesNotMatch(html, /data:audio\/mpeg/);
  assert.doesNotMatch(html, /data:image\/webp/);

  // Order on the page: art, then the player, then the download, then the story.
  const at = (needle) => html.indexOf(needle);
  assert.ok(at('class="album-art"') < at('id="song-audio"'));
  assert.ok(at('id="song-audio"') < at('class="song-download"'));
  assert.ok(at('class="song-download"') < at('id="story-heading"'));

  // The live preview has no folder, so it carries the picked files inline.
  const preview = app.buildPage(keepsake);
  assert.match(preview, /<audio id="song-audio" controls preload="metadata" src="data:audio\/mpeg/);
});

test('the song file name is friendly and safe on any device', () => {
  const app = loadBuilder();
  assert.equal(app.songFileName('We Love You, Mrs. Gaynor'), 'We Love You, Mrs. Gaynor - Heartstrings Studio.mp3');
  assert.equal(app.songFileName('Mom/Dad: "Always"?'), 'Mom Dad Always - Heartstrings Studio.mp3');
  assert.equal(app.songFileName('  '), 'Your Song - Heartstrings Studio.mp3');
});

test('YouTube is never embedded, and only ever a small link at the bottom', () => {
  const app = loadBuilder();
  const html = app.buildPage(Object.assign({}, keepsake, { publish: true }));
  assert.doesNotMatch(html, /<iframe/);
  assert.doesNotMatch(html, /youtube-nocookie/);
  assert.match(html, /<p class="also-youtube"><a href="https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ"[^>]*>Also on YouTube<\/a><\/p>/);
  // Below everything else on the page, footer aside.
  assert.ok(html.indexOf('class="also-youtube"') > html.indexOf('id="share-heading"'));
  assert.ok(html.indexOf('class="also-youtube"') < html.indexOf('<footer'));

  const without = app.buildPage(Object.assign({}, keepsake, { youtube: '', publish: true }));
  assert.doesNotMatch(without, /also-youtube"/);
  assert.doesNotMatch(without, /youtube\.com/);
});

test('the video button shows only when a video link is filled in', () => {
  const app = loadBuilder();
  const drive = 'https://drive.google.com/file/d/abc123/view?usp=sharing';
  const withVideo = app.buildPage(Object.assign({}, keepsake, { videoLink: drive, publish: true }));
  assert.ok(withVideo.includes(`<a class="video-link" href="${drive.replace(/&/g, '&amp;')}" target="_blank" rel="noopener">Watch the video</a>`));

  for (const blank of ['', '   ', undefined, 'not a link', 'javascript:alert(1)', 'http://drive.google.com/x']) {
    const html = app.buildPage(Object.assign({}, keepsake, { videoLink: blank, publish: true }));
    assert.doesNotMatch(html, /class="video-link"/, `no button for ${JSON.stringify(blank)}`);
    assert.doesNotMatch(html, /Watch the video/);
  }
});

test('the share video gets a download in the keepsake downloads, never a file in the folder', () => {
  const app = loadBuilder();
  const html = app.buildPage(Object.assign({}, keepsake, { videoLink: 'https://drive.google.com/file/d/abc_12-3/view?usp=sharing', publish: true }));
  assert.ok(html.includes('<a class="keepsake-download" href="https://drive.google.com/uc?export=download&amp;id=abc_12-3" target="_blank" rel="noopener"><strong>Download your share video</strong>'));
  // Owner-only, like the lyric sheet: the downloads section hides on ?share.
  assert.match(html, /<section class="section reveal" aria-labelledby="downloads-heading">[\s\S]*Download your share video/);
  assert.doesNotMatch(html, /video\.mp4|\.mp4"/);

  // A link that isn't a Drive file is used as it is.
  const other = app.buildPage(Object.assign({}, keepsake, { videoLink: 'https://example.com/v.mp4', publish: true }));
  assert.ok(other.includes('href="https://example.com/v.mp4" target="_blank" rel="noopener"><strong>Download your share video</strong>'));

  const without = app.buildPage(Object.assign({}, keepsake, { publish: true }));
  assert.doesNotMatch(without, /Download your share video/);
});

test('the builder requires the share video link', () => {
  assert.match(builder, /<input type="url" id="videoLink"[^>]* required \/>/);
  assert.ok(builder.includes("if (!els.videoLink.value.trim()) errors.push('Share video link (MP4 on Google Drive)');"));
});

test('page copy speaks as one songwriter and names no tools', () => {
  const app = loadBuilder();
  const html = app.buildPage(Object.assign({}, keepsake, { publish: true, videoLink: 'https://drive.google.com/x' }));
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /\b(we|us|our|ours|we're|we've)\b/i);
  assert.doesNotMatch(html, /\b(AI|Suno|Keepsake Builder)\b/);
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

test('a shared link keeps the player but hides the downloads', () => {
  const app = loadBuilder();
  const html = app.buildPage(keepsake);

  // The marker is read in the head, before anything renders.
  assert.match(html, /className\+=" sharing"/);
  assert.match(html, /location\.search\+window\.location\.hash/);
  // ...and the downloads are hidden when it is set; the player is not.
  assert.match(html, /html\.sharing section\[aria-labelledby="downloads-heading"\],html\.sharing \.song-download\{display:none\}/);
  assert.doesNotMatch(html, /html\.sharing section\[aria-labelledby="listen-heading"\]/);
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

test('delivery is a folder of index.html, art.jpg and song.mp3', () => {
  assert.ok(builder.includes("return 'keepsakes/' + slugify(els.pageCode.value) + '/';"));
  for (const name of ["currentFilename()]", "'art.jpg']", "'song.mp3']"]) {
    assert.ok(builder.includes(name), `the download should save ${name}`);
  }
});

test('the builder requires the MP3 and warns over 15 MB', () => {
  assert.ok(builder.includes("if (!songMp3DataUrl) errors.push('Song MP3');"));
  assert.ok(builder.includes('var MP3_WARN_BYTES = 15 * 1048576;'));
  assert.match(builder, /re-export(ed)? at 192 kbps/);
});

test('production controls remain present in the builder', () => {
  for (const token of ['id="pageCode"', 'id="songMp3"', 'id="videoLink"', 'id="lyricsPdf"', 'id="consent"', 'id="saveDraft"', 'optimizeArtwork']) {
    assert.ok(builder.includes(token), `missing ${token}`);
  }
});
