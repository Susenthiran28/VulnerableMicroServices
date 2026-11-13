'use strict';

let loaded;
let observed;

try {
  loaded = require('../../../src/AccountService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  observed = {
    type: typeof loaded,
    isFunction: typeof loaded === 'function',
    hasUse: !!(loaded && typeof loaded.use === 'function'),
    hasHandle: !!(loaded && typeof loaded.handle === 'function')
  };
} catch (e) {
  console.error('Failed to observe module shape:', e && e.stack ? e.stack : e);
  process.exit(1);
}

const expected = {
  type: 'function',
  isFunction: true,
  hasUse: true,
  hasHandle: true
};

if (
  observed.type !== expected.type ||
  observed.isFunction !== expected.isFunction ||
  observed.hasUse !== expected.hasUse ||
  observed.hasHandle !== expected.hasHandle
) {
  console.error('Observed behavior changed. Expected:', expected, 'Observed:', observed);
  process.exit(1);
}

process.exit(0);
