const path = require('path');

function fail(msg, err) {
  if (err) {
    console.error(msg, err && err.stack ? err.stack : err);
  } else {
    console.error(msg);
  }
  process.exit(1);
}

const target = path.join(__dirname, '../../../src/AccountService/models/Account.js');

let Account;
try {
  Account = require(target);
} catch (e) {
  fail('Failed to load module: ' + target, e);
}

let doc;
try {
  doc = new Account({
    username: 'u',
    email: 'e@example.com',
    password: 'p'
  });
} catch (e) {
  fail('Constructing Account threw unexpectedly', e);
}

const observed = {
  modelName: Account && Account.modelName,
  collectionName: Account && Account.collection && Account.collection.name,
  username: doc && doc.username,
  email: doc && doc.email,
  password: doc && doc.password,
  hasCreatedAt: !!(doc && doc.created_at instanceof Date),
  hasModifiedAt: !!(doc && doc.modified_at instanceof Date)
};

const expected = {
  modelName: 'account',
  collectionName: 'accounts',
  username: 'u',
  email: 'e@example.com',
  password: 'p',
  hasCreatedAt: true,
  hasModifiedAt: true
};

if (JSON.stringify(observed) !== JSON.stringify(expected)) {
  fail('Observed model behavior changed. expected=' + JSON.stringify(expected) + ' observed=' + JSON.stringify(observed));
}

process.exit(0);
