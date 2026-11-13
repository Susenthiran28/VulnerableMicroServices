function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let router;
try {
  router = require('../../../src/AuthenticationService/routes/users.js');
} catch (e) {
  fail('load failed: ' + (e && e.message));
}

if (!router || typeof router !== 'function' || !router.handle || !Array.isArray(router.stack)) {
  fail('unexpected export shape');
}

const routes = router.stack.filter(l => l && l.route).map(l => ({
  path: l.route.path,
  methods: Object.keys(l.route.methods).sort().join(',')
}));

const expected = JSON.stringify([{ path: '/', methods: 'get' }]);
if (JSON.stringify(routes) !== expected) {
  fail('route surface changed');
}

process.exit(0);
