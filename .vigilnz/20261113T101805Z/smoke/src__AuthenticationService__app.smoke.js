'use strict';

let app;
try {
  app = require('../../../src/AuthenticationService/app.js');
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

try {
  if (!app || typeof app !== 'function') {
    throw new Error('Expected exported app to be a function');
  }

  const settings = app.settings || {};
  if (settings['view engine'] !== 'ejs') {
    throw new Error('Unexpected view engine: ' + String(settings['view engine']));
  }

  if (typeof app.handle !== 'function') {
    throw new Error('Expected app.handle to be a function');
  }
} catch (e) {
  console.error('Behavior check failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
