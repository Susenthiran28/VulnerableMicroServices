const path = require('path');

let app;
try {
  app = require('../../../src/AccountService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (!app || typeof app !== 'function') {
    throw new Error('Expected exported app to be a function');
  }

  if (!app._router || !Array.isArray(app._router.stack)) {
    throw new Error('Expected express router stack to exist');
  }

  const stack = app._router.stack;
  const hasApiAccount = stack.some((layer) => {
    return layer && layer.regexp && String(layer.regexp).includes('/api/account');
  });

  if (!hasApiAccount) {
    throw new Error('Expected /api/account middleware route to be mounted');
  }

  // Characterize current observed behavior: express app has middleware stack and mounted account route.
  process.exit(0);
} catch (e) {
  console.error('Smoke test failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
