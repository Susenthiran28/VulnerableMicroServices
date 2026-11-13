function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let router;
try {
  router = require('../../../src/AccountService/routes/index.js');
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

const fingerprint = JSON.stringify(routes);
const expected = JSON.stringify([
  { path: '/', methods: 'get' },
  { path: '/', methods: 'put' },
  { path: '/', methods: 'post' },
  { path: '/:user', methods: 'get' },
  { path: '/:user', methods: 'delete' }
]);

if (fingerprint !== expected) {
  fail('route surface changed: ' + fingerprint);
}

process.exit(0);
