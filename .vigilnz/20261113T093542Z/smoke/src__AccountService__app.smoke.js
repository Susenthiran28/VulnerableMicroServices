const assert = require('assert');

let mod;
try {
  mod = require('../../../src/AccountService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

try {
  assert.strictEqual(typeof mod, 'function', 'Expected express app export to be a function');
  assert.strictEqual(typeof mod.use, 'function', 'Expected app.use to exist');
  assert.strictEqual(typeof mod.handle, 'function', 'Expected app.handle to exist');
  assert.strictEqual(mod.mountpath, '/', 'Expected default mountpath to be /');
} catch (e) {
  console.error('Behavior changed:', e && e.message);
  process.exit(1);
}

process.exit(0);
