const path = require('path');

let loaded;
try {
  const targetPath = path.join(__dirname, '../../../src/AccountService/app.js');
  loaded = require(targetPath);
} catch (err) {
  console.error('Failed to load module:', err && err.stack ? err.stack : err);
  process.exit(1);
}

try {
  if (!loaded) {
    throw new Error('Loaded export is falsy');
  }

  if (typeof loaded !== 'function') {
    throw new Error('Expected exported app to be a function');
  }

  // Characterize current observable behavior: Express app exposes middleware stack.
  const hasUse = typeof loaded.use === 'function';
  const hasHandle = typeof loaded.handle === 'function';
  const hasStack = !!(loaded._router && Array.isArray(loaded._router.stack));

  if (!hasUse || !hasHandle || !hasStack) {
    throw new Error('Exported app shape changed from current behavior');
  }
} catch (err) {
  console.error('Smoke test failed:', err && err.stack ? err.stack : err);
  process.exit(1);
}
