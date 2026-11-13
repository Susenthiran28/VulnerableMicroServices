const assert = require('assert');

let app;
try {
  app = require('../../../src/FrontendService/app.js');
} catch (e) {
  console.error('Failed to load app:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  const observed = {
    type: typeof app,
    isFunction: typeof app === 'function',
    viewEngine: app && typeof app.get === 'function' ? app.get('view engine') : undefined,
    env: app && typeof app.get === 'function' ? app.get('env') : undefined,
  };

  const expected = {
    type: 'function',
    isFunction: true,
    viewEngine: 'ejs',
    env: 'development',
  };

  assert.deepStrictEqual(observed, expected);
} catch (e) {
  console.error('Behavior changed or invocation failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
