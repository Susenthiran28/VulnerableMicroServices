let mod;
try {
  mod = require('../../../src/AccountService/routes/index.js');
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

try {
  if (!mod || typeof mod !== 'function') {
    throw new Error('Export shape changed: expected Express router function');
  }

  const expectedProps = ['use', 'get', 'put', 'handle', 'stack'];
  for (const p of expectedProps) {
    if (!(p in mod)) throw new Error(`Missing expected router property: ${p}`);
  }

  if (!Array.isArray(mod.stack)) {
    throw new Error('Router stack is not an array');
  }

  const routePaths = mod.stack
    .filter(l => l && l.route && l.route.path)
    .map(l => `${Object.keys(l.route.methods).sort().join(',')}:${l.route.path}`)
    .sort();

  const expected = ['get:/', 'put:/'];
  if (routePaths.length !== expected.length || routePaths.some((v, i) => v !== expected[i])) {
    throw new Error(`Route signature changed: got ${JSON.stringify(routePaths)} expected ${JSON.stringify(expected)}`);
  }
} catch (e) {
  console.error('Behavior check failed:', e && e.message);
  process.exit(1);
}
