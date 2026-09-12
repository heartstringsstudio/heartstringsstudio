import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const playerCode = source.slice(source.indexOf('function fillPlayer('), source.indexOf('function startSong('));

function element(tag) {
  return {
    tag, children: [], events: {}, classList: { add() {} },
    append(...nodes) { for (const node of nodes) { node.parent = this; this.children.push(node); } },
    addEventListener(name, fn) { this.events[name] = fn; },
    querySelector(name) { return this.children.find(child => child.tag === name); },
    remove() { this.parent.children = this.parent.children.filter(child => child !== this); },
  };
}

test('slow YouTube loading keeps the player and removes help when ready', () => {
  let timeout;
  let open = true;
  const context = vm.createContext({
    document: { createElement: element }, navigator: { onLine: true },
    setTimeout(fn) { timeout = fn; },
    buildBar: () => element('bar'),
    buildFallback: () => { const help = element('help'); help.append(element('p')); return help; },
  });
  vm.runInContext(playerCode, context);
  const container = element('container');
  context.fillPlayer(container, ['example', '', '', 'Example song'], null, () => open);
  const frame = container.children[0];
  const iframe = frame.children[0];
  timeout();
  assert.equal(container.children[0], frame, 'the timeout must preserve the iframe container');
  assert.equal(frame.children[0], iframe, 'the original player must survive slow loading');
  assert.equal(container.children.length, 3, 'loading help should accompany the frame and close bar');
  iframe.events.load();
  assert.equal(container.children.length, 2, 'loading help should disappear once ready');

  const closed = element('closed-container');
  context.fillPlayer(closed, ['example', '', '', 'Example song'], null, () => open);
  open = false;
  timeout();
  assert.equal(closed.children.length, 2, 'late timeouts must not modify closed players');
});
