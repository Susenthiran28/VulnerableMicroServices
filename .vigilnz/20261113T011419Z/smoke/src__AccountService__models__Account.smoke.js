const path = require('path');

const targetPath = path.join(__dirname, '../../../src/AccountService/models/Account.js');

let Account;
try {
  Account = require(targetPath);
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

let instance;
try {
  instance = new Account({ username: 'u', email: 'e', password: 'p' });
} catch (e) {
  console.error('Failed to construct model instance:', e && e.message);
  process.exit(1);
}

const observed = {
  modelName: Account && Account.modelName,
  collectionName: Account && Account.collection && Account.collection.name,
  schemaPaths: Object.keys((Account && Account.schema && Account.schema.paths) || {}).sort(),
  hasCreatedAt: !!(instance && instance.created_at instanceof Date),
  hasModifiedAt: !!(instance && instance.modified_at instanceof Date),
  username: instance && instance.username,
  email: instance && instance.email,
  password: instance && instance.password
};

const expected = {
  modelName: 'account',
  collectionName: 'accounts',
  schemaPaths: ['__v', '_id', 'created_at', 'email', 'full_name', 'modified_at', 'password', 'username'],
  hasCreatedAt: true,
  hasModifiedAt: true,
  username: 'u',
  email: 'e',
  password: 'p'
};

if (
  observed.modelName !== expected.modelName ||
  observed.collectionName !== expected.collectionName ||
  JSON.stringify(observed.schemaPaths) !== JSON.stringify(expected.schemaPaths) ||
  observed.hasCreatedAt !== expected.hasCreatedAt ||
  observed.hasModifiedAt !== expected.hasModifiedAt ||
  observed.username !== expected.username ||
  observed.email !== expected.email ||
  observed.password !== expected.password
) {
  console.error('Observed behavior changed.', { observed, expected });
  process.exit(1);
}

process.exit(0);
