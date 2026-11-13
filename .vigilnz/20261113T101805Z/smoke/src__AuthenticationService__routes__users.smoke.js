function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let router;
try {
  router = require('../../../src/AuthenticationService/routes/users.js');
} catch (e) {
  fail('Failed to load module: ' + (e && e.message));
}

if (!router || typeof router !== 'function' || !Array.isArray(router.stack)) {
  fail('Unexpected export shape for AuthenticationService users router');
}

const routePaths = router.stack.filter(l => l && l.route).map(l => l.route.path);
const expected = ['/'];
if (JSON.stringify(routePaths) !== JSON.stringify(expected)) {
  fail('AuthenticationService users route paths changed: ' + JSON.stringify(routePaths));
}

process.exit(0);
