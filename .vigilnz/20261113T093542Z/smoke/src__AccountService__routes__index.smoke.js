'use strict';

const path = require('path');

let loaded;
try {
  loaded = require(path.join(__dirname, '../../../src/AccountService/routes/index.js'));
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (!loaded || typeof loaded !== 'function' || !Array.isArray(loaded.stack)) {
    console.error('Unexpected export shape for router module');
    process.exit(1);
  }

  const methodsByPath = loaded.stack
    .filter(layer => layer && layer.route && layer.route.path)
    .map(layer => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods || {}).sort()
    }));

  const observed = JSON.stringify(methodsByPath);
  const expected = JSON.stringify([
    { path: '/', methods: ['get'] },
    { path: '/', methods: ['put'] },
    { path: '/', methods: ['post'] },
    { path: '/:user', methods: ['get'] }
  ]);

  if (observed !== expected) {
    console.error('Router behavior changed.');
    console.error('Observed:', observed);
    console.error('Expected:', expected);
    process.exit(1);
  }
} catch (e) {
  console.error('Smoke test execution failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
