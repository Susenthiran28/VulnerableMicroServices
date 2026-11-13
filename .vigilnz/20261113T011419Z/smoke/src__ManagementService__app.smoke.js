const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let app;
try {
  app = require('../../../src/ManagementService/app.js');
} catch (e) {
  fail('Failed to load module: ' + (e && e.stack ? e.stack : e));
}

try {
  if (!app || typeof app !== 'function') {
    fail('Expected exported app to be a function');
  }

  const baseline = {
    viewEngine: 'ejs',
    mountPath: '/',
    hasHandle: typeof app.handle === 'function',
    hasSet: typeof app.set === 'function',
    hasUse: typeof app.use === 'function'
  };

  const observed = {
    viewEngine: app.get && app.get('view engine'),
    mountPath: app.mountpath,
    hasHandle: typeof app.handle === 'function',
    hasSet: typeof app.set === 'function',
    hasUse: typeof app.use === 'function'
  };

  if (JSON.stringify(observed) !== JSON.stringify(baseline)) {
    fail('Observed app shape changed. Expected ' + JSON.stringify(baseline) + ' got ' + JSON.stringify(observed));
  }
} catch (e) {
  fail('Smoke assertions failed: ' + (e && e.stack ? e.stack : e));
}
