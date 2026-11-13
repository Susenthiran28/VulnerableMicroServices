const path = require('path');

let loaded;
try {
  loaded = require('../../../src/AccountService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  const baselineType = 'function';
  const actualType = typeof loaded;
  if (actualType !== baselineType) {
    console.error(`Baseline changed: expected export type ${baselineType}, got ${actualType}`);
    process.exit(1);
  }

  const baselineHasUse = true;
  const hasUse = !!(loaded && typeof loaded.use === 'function');
  if (hasUse !== baselineHasUse) {
    console.error(`Baseline changed: expected app.use presence ${baselineHasUse}, got ${hasUse}`);
    process.exit(1);
  }

  const baselineHasHandle = true;
  const hasHandle = !!(loaded && typeof loaded.handle === 'function');
  if (hasHandle !== baselineHasHandle) {
    console.error(`Baseline changed: expected app.handle presence ${baselineHasHandle}, got ${hasHandle}`);
    process.exit(1);
  }
} catch (e) {
  console.error('Smoke test invocation failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
