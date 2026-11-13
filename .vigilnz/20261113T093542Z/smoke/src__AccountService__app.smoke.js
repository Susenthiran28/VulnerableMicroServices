'use strict';

let loaded;
let observed;

try {
  loaded = require('../../../src/AccountService/app.js');
} catch (err) {
  console.error('Failed to load module:', err && err.stack ? err.stack : err);
  process.exit(1);
}

try {
  if (typeof loaded !== 'function') {
    throw new Error('Expected exported app to be a function');
  }

  const req = {
    method: 'GET',
    url: '/__vigilnz_smoke__',
    headers: {},
    app: { get: () => 'production' }
  };

  observed = { statusCode: null, body: null, headers: {} };

  const res = {
    locals: {},
    status(code) {
      observed.statusCode = code;
      return this;
    },
    json(obj) {
      observed.body = obj;
      return this;
    },
    setHeader(k, v) {
      observed.headers[k.toLowerCase()] = v;
    },
    getHeader(k) {
      return observed.headers[String(k).toLowerCase()];
    }
  };

  loaded(req, res, function next(err) {
    if (err) {
      throw err;
    }
  });
} catch (err) {
  console.error('Failed to call exported app:', err && err.stack ? err.stack : err);
  process.exit(1);
}

const expected = {
  statusCode: 404,
  body: {
    status: 'FAIL',
    message: 'Not Found'
  }
};

if (!observed || observed.statusCode !== expected.statusCode || !observed.body || observed.body.status !== expected.body.status || observed.body.message !== expected.body.message) {
  console.error('Observed behavior changed.', { observed, expected });
  process.exit(1);
}

process.exit(0);
