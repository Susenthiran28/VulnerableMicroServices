const path = require('path');

let mod;
try {
  mod = require(path.join(__dirname, '../../../src/AuthenticationService/app.js'));
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (typeof mod !== 'function') {
    console.error('Unexpected export type for app.js');
    process.exit(1);
  }

  const viewEngine = mod.get && mod.get('view engine');
  if (viewEngine !== 'ejs') {
    console.error('Observed behavior changed: expected view engine to be ejs, got:', viewEngine);
    process.exit(1);
  }
} catch (e) {
  console.error('Failure while checking behavior:', e && e.stack ? e.stack : e);
  process.exit(1);
}

process.exit(0);
