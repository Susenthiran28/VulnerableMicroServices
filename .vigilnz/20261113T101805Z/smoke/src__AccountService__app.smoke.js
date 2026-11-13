const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let loaded;
try {
  loaded = require('../../../src/AccountService/app.js');
} catch (e) {
  fail('Failed to load module: ' + (e && e.message));
}

if (!loaded || typeof loaded !== 'function' || typeof loaded.use !== 'function') {
  fail('Unexpected export shape for AccountService app');
}

if (loaded.mountpath !== '/') {
  fail('AccountService app mountpath changed: ' + String(loaded.mountpath));
}

process.exit(0);
