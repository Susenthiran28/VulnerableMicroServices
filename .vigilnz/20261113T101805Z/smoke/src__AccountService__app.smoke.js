const path = require('path');

function fail(msg, err) {
  if (err) {
    console.error(msg, err && err.stack ? err.stack : err);
  } else {
    console.error(msg);
  }
  process.exit(1);
}

const target = path.join(__dirname, '../../../src/AccountService/app.js');

let loaded;
try {
  loaded = require(target);
} catch (e) {
  fail('Failed to load module: ' + target, e);
}

const observed = {
  type: typeof loaded,
  hasUse: !!(loaded && typeof loaded.use === 'function'),
  hasHandle: !!(loaded && typeof loaded.handle === 'function'),
  hasListen: !!(loaded && typeof loaded.listen === 'function')
};

const expected = {
  type: 'function',
  hasUse: true,
  hasHandle: true,
  hasListen: true
};

if (JSON.stringify(observed) !== JSON.stringify(expected)) {
  fail('Observed export shape changed. expected=' + JSON.stringify(expected) + ' observed=' + JSON.stringify(observed));
}

try {
  const req = { method: 'GET', url: '/__vigilnz_smoke__', headers: {}, app: loaded };
  const res = {
    locals: {},
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    setHeader() {},
    getHeader() { return undefined; },
    end() {}
  };
  loaded.handle(req, res, function noop() {});
} catch (e) {
  fail('Calling app.handle threw unexpectedly', e);
}

process.exit(0);
