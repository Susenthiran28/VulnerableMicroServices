const path = require('path');

const targetPath = path.join(__dirname, '../../../src/AccountService/app.js');

let exported;
try {
  exported = require(targetPath);
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

const observed = {
  type: typeof exported,
  isFunction: typeof exported === 'function',
  hasUse: !!(exported && typeof exported.use === 'function'),
  hasHandle: !!(exported && typeof exported.handle === 'function')
};

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
  console.error('Observed behavior changed.', { observed, expected });
  process.exit(1);
}

process.exit(0);
