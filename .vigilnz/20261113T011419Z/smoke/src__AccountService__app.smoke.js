const path = require('path');

const targetPath = path.join(__dirname, '../../../src/AccountService/app.js');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let exported;
try {
  exported = require(targetPath);
} catch (e) {
  fail(`LOAD_FAIL: ${e && e.stack ? e.stack : e}`);
}

try {
  if (!exported || typeof exported !== 'function') {
    fail(`UNEXPECTED_EXPORT_TYPE: ${typeof exported}`);
  }

  const currentShape = {
    isFunction: typeof exported === 'function',
    hasUse: typeof exported.use === 'function',
    hasHandle: typeof exported.handle === 'function',
    hasListen: typeof exported.listen === 'function',
    constructorName: exported && exported.constructor ? exported.constructor.name : null,
  };

  const expectedShape = {
    isFunction: true,
    hasUse: true,
    hasHandle: true,
    hasListen: true,
    constructorName: 'Function',
  };

  const same = JSON.stringify(currentShape) === JSON.stringify(expectedShape);
  if (!same) {
    fail(`SHAPE_CHANGED: observed=${JSON.stringify(currentShape)} expected=${JSON.stringify(expectedShape)}`);
  }

  process.exit(0);
} catch (e) {
  fail(`CALL_FAIL: ${e && e.stack ? e.stack : e}`);
}
