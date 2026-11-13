function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let loaded;
try {
  loaded = require('../../../src/AuthenticationService/app.js');
} catch (e) {
  fail('Failed to load module: ' + (e && e.message));
}

if (!loaded || typeof loaded !== 'function' || typeof loaded.use !== 'function') {
  fail('Unexpected export shape for AuthenticationService app');
}

if (loaded.mountpath !== '/') {
  fail('AuthenticationService app mountpath changed: ' + String(loaded.mountpath));
}

process.exit(0);
