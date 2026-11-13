function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let router;
try {
  router = require('../../../src/AuthenticationService/routes/index.js');
} catch (e) {
  fail('Failed to load module: ' + (e && e.message));
}

if (!router || typeof router !== 'function' || !Array.isArray(router.stack)) {
  fail('Unexpected export shape for AuthenticationService index router');
}

const routePaths = router.stack.filter(l => l && l.route).map(l => l.route.path);
const expected = ['/'];
if (JSON.stringify(routePaths) !== JSON.stringify(expected)) {
  fail('AuthenticationService index route paths changed: ' + JSON.stringify(routePaths));
}

process.exit(0);
