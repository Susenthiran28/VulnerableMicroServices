const assert = require('assert');

let router;
try {
  router = require('../../../src/AuthenticationService/routes/users.js');
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

try {
  assert.strictEqual(typeof router, 'function', 'Expected router export to be a function');
  assert.ok(Array.isArray(router.stack), 'Expected router.stack to be an array');

  const hasRootGet = router.stack.some((layer) => layer && layer.route && layer.route.path === '/' && layer.route.methods && layer.route.methods.get);
  assert.strictEqual(hasRootGet, true, 'Expected GET / route');
} catch (e) {
  console.error('Behavior changed:', e && e.message);
  process.exit(1);
}

process.exit(0);
