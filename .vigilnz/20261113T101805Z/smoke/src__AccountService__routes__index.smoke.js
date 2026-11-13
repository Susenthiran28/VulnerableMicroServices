const path = require('path');

function fail(msg, err) {
  if (msg) console.error(msg);
  if (err) console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

let router;
try {
  router = require(path.join(__dirname, '../../../src/AccountService/routes/index.js'));
} catch (e) {
  fail('Failed to load module', e);
}

if (!router || !Array.isArray(router.stack)) {
  fail('Loaded export is not an express router with a stack');
}

function hasRoute(method, routePath) {
  return router.stack.some((layer) => {
    if (!layer || !layer.route || layer.route.path !== routePath) return false;
    const methods = layer.route.methods || {};
    return methods[method] === true;
  });
}

const observed = {
  rootGet: hasRoute('get', '/'),
  rootPut: hasRoute('put', '/'),
  rootPost: hasRoute('post', '/'),
  userGet: hasRoute('get', '/:user')
};

const expected = {
  rootGet: true,
  rootPut: true,
  rootPost: true,
  userGet: true
};

for (const k of Object.keys(expected)) {
  if (observed[k] !== expected[k]) {
    fail(`Behavior changed for ${k}: expected ${expected[k]}, got ${observed[k]}`);
  }
}

process.exit(0);
