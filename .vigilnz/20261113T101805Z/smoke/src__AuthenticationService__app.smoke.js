'use strict';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let app;
try {
  app = require('../../../src/AuthenticationService/app.js');
} catch (e) {
  fail('Failed to load ../../../src/AuthenticationService/app.js: ' + (e && e.stack ? e.stack : e));
}

if (!app || typeof app !== 'function') {
  fail('Expected exported app to be a function');
}

const baseline = {
  type: typeof app,
  isFunction: typeof app === 'function',
  hasUse: typeof app.use === 'function',
  hasSet: typeof app.set === 'function',
  mountpath: app.mountpath,
  views: typeof app.get === 'function' ? app.get('views') : undefined,
  viewEngine: typeof app.get === 'function' ? app.get('view engine') : undefined,
  env: typeof app.get === 'function' ? app.get('env') : undefined,
};

const expected = {
  type: 'function',
  isFunction: true,
  hasUse: true,
  hasSet: true,
  mountpath: '/',
  views: '/src/AuthenticationService/views',
  viewEngine: 'ejs',
  env: 'development',
};

if (JSON.stringify(baseline) !== JSON.stringify(expected)) {
  fail('Behavior changed. Observed: ' + JSON.stringify(baseline) + ' Expected: ' + JSON.stringify(expected));
}

process.exit(0);
