const path = require('path');

let router;
try {
  router = require(path.join(__dirname, '../../../src/AccountService/routes/index.js'));
} catch (e) {
  console.error('Failed to load router module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (typeof router !== 'function') {
    console.error('Unexpected export type for routes/index.js');
    process.exit(1);
  }

  const stack = router.stack;
  if (!Array.isArray(stack)) {
    console.error('Observed behavior changed: router.stack is not an array');
    process.exit(1);
  }

  const hasRootGet = stack.some(layer => layer && layer.route && layer.route.path === '/' && layer.route.methods && layer.route.methods.get === true);
  if (!hasRootGet) {
    console.error('Observed behavior changed: expected GET / route not found');
    process.exit(1);
  }
} catch (e) {
  console.error('Failure while checking router behavior:', e && e.stack ? e.stack : e);
  process.exit(1);
}

process.exit(0);
