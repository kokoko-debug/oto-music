const { spawnSync } = require('node:child_process');
const path = require('node:path');
const tests = ['learning-content', 'learning-state', 'keyboard-intervals', 'keyboard-chords', 'storage', 'advanced'];
for (const name of tests) {
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'tests', `test-${name}.cjs`)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
