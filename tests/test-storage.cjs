const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'storage.js'), 'utf8');
const previous = { page: 'chord', learning: { foundationVersion: 2, chordKeys: [70, 75, 79] }, wrong: ['c-minor'] };
function load(value, fail = false) {
  const context = { window: {}, localStorage: {
    getItem(key) { assert.equal(key, 'oto-learning-preview'); if (fail) throw new Error('unavailable'); return value; },
    setItem(key, text) { assert.equal(key, 'oto-learning-preview'); if (fail) throw new Error('unavailable'); context.written = text; }
  } };
  vm.runInNewContext(source, context);
  return context;
}
(async () => {
  const existing = load(JSON.stringify(previous));
  assert.deepEqual(JSON.parse(JSON.stringify(existing.window.openai.widgetState)), previous);
  await existing.window.openai.setWidgetState(previous);
  assert.deepEqual(JSON.parse(existing.written), previous);
  for (const context of [load(null), load('{invalid'), load(null, true)]) {
    assert.equal(context.window.openai.widgetState, null);
    await context.window.openai.setWidgetState(previous);
    assert.equal(context.window.openai.widgetState, previous);
  }
  console.log('PASS: desktop storage compatibility, reload, corrupt and unavailable storage.');
})().catch(error => { console.error(error); process.exitCode = 1; });
