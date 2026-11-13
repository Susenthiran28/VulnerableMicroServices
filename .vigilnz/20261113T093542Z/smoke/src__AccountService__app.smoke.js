const path = require('path');

let mod;
try {
  mod = require(path.join(__dirname, '../../../src/AccountService/app.js'));
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (typeof mod !== 'function') {
    console.error('Unexpected export type for app.js');
    process.exit(1);
  }

  const settingsFn = mod && mod.settings && mod.settings['x-powered-by'];
  if (typeof settingsFn !== 'boolean') {
    console.error('Observed behavior changed: expected express app with boolean x-powered-by setting');
    process.exit(1);
  }
} catch (e) {
  console.error('Failure while checking behavior:', e && e.stack ? e.stack : e);
  process.exit(1);
}

process.exit(0);
