const assert = require('assert');

let app;
try {
  app = require('../../../src/AuthenticationService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  assert.strictEqual(typeof app, 'function', 'export should be an express app function');
  assert.strictEqual(typeof app.use, 'function', 'app.use should exist');
  assert.strictEqual(typeof app.set, 'function', 'app.set should exist');

  const viewEngine = app.get('view engine');
  const env = app.get('env');

  assert.strictEqual(viewEngine, 'ejs', 'view engine changed from observed value');
  assert.strictEqual(env, 'development', 'env changed from observed default value');

  const stack = app && app._router && app._router.stack;
  assert.ok(Array.isArray(stack), 'router stack should exist');
  assert.strictEqual(stack.length, 9, 'middleware/route stack length changed from observed value');
} catch (e) {
  console.error('Behavior check failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
