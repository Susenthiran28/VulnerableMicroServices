const path = require('path');

const targetPath = path.join(__dirname, '../../../src/ProductService/models/Product.js');

let Product;
try {
  Product = require(targetPath);
} catch (e) {
  console.error('Failed to load module:', e && e.message);
  process.exit(1);
}

let instance;
try {
  instance = new Product({
    product_name: 'n',
    product_description: 'd',
    product_price: 1
  });
} catch (e) {
  console.error('Failed to construct model instance:', e && e.message);
  process.exit(1);
}

const observed = {
  modelName: Product && Product.modelName,
  collectionName: Product && Product.collection && Product.collection.name,
  schemaPaths: Object.keys((Product && Product.schema && Product.schema.paths) || {}).sort(),
  hasCreatedAt: !!(instance && instance.created_at instanceof Date),
  hasModifiedAt: !!(instance && instance.modified_at instanceof Date),
  product_name: instance && instance.product_name,
  product_description: instance && instance.product_description,
  product_price: instance && instance.product_price
};

const expected = {
  modelName: 'product',
  collectionName: 'products',
  schemaPaths: ['__v', '_id', 'created_at', 'modified_at', 'product_description', 'product_image', 'product_name', 'product_price'],
  hasCreatedAt: true,
  hasModifiedAt: true,
  product_name: 'n',
  product_description: 'd',
  product_price: 1
};

if (
  observed.modelName !== expected.modelName ||
  observed.collectionName !== expected.collectionName ||
  JSON.stringify(observed.schemaPaths) !== JSON.stringify(expected.schemaPaths) ||
  observed.hasCreatedAt !== expected.hasCreatedAt ||
  observed.hasModifiedAt !== expected.hasModifiedAt ||
  observed.product_name !== expected.product_name ||
  observed.product_description !== expected.product_description ||
  observed.product_price !== expected.product_price
) {
  console.error('Observed behavior changed.', { observed, expected });
  process.exit(1);
}

process.exit(0);
