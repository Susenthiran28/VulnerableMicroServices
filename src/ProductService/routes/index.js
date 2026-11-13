var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

function hasOperatorKeys(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  return Object.keys(obj).some(function (key) {
    return key.indexOf('$') === 0 || key.indexOf('.') !== -1;
  });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidPrice(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function pickAllowedProductFields(body) {
  var out = {};
  if (Object.prototype.hasOwnProperty.call(body, 'product_name')) {
    out.product_name = body.product_name;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'product_description')) {
    out.product_description = body.product_description;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'product_price')) {
    out.product_price = body.product_price;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'product_image')) {
    out.product_image = body.product_image;
  }
  return out;
}

function validateProductFields(fields, requireAll) {
  if (requireAll) {
    if (!isNonEmptyString(fields.product_name)) {
      return 'Invalid product_name';
    }
    if (!isNonEmptyString(fields.product_description)) {
      return 'Invalid product_description';
    }
    if (!isValidPrice(fields.product_price)) {
      return 'Invalid product_price';
    }
    if (!isNonEmptyString(fields.product_image)) {
      return 'Invalid product_image';
    }
    return null;
  }

  var keys = Object.keys(fields);
  if (keys.length === 0) {
    return 'No valid fields to update';
  }

  if (Object.prototype.hasOwnProperty.call(fields, 'product_name') && !isNonEmptyString(fields.product_name)) {
    return 'Invalid product_name';
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'product_description') && !isNonEmptyString(fields.product_description)) {
    return 'Invalid product_description';
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'product_price') && !isValidPrice(fields.product_price)) {
    return 'Invalid product_price';
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'product_image') && !isNonEmptyString(fields.product_image)) {
    return 'Invalid product_image';
  }

  return null;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200);
  res.json({
    status: 'OK',
    app: 'ProductService',
    version: 'v1.0.0'
  });
});

// Create product
router.put('/', function (req, res, next) {
  if (hasOperatorKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var newProduct = pickAllowedProductFields(req.body || {});
  var createValidationError = validateProductFields(newProduct, true);
  if (createValidationError) {
    return res.status(400).json({
      status: 'FAIL',
      message: createValidationError
    });
  }

  Product.findOne({ product_name: newProduct.product_name })
    .then(product => {
      if (!product) {
        Product.create(newProduct).then( doc => {
          return res.status(200).json({
            status: 'OK',
            data: doc
          });
        }).catch(error => {
          return res.status(400).json({
            status: 'FAIL',
            message: error.message
          })
        })
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Product already exists'
        })
      }
    })
});

// Find product
router.post('/', function (req, res, next) {
  if (hasOperatorKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var query = null;
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, '_id')) {
    if (!isValidObjectId(req.body._id)) {
      return res.status(400).json({
        status: 'FAIL',
        message: 'Invalid product id'
      });
    }
    query = { _id: req.body._id };
  } else if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'product_name')) {
    if (!isNonEmptyString(req.body.product_name)) {
      return res.status(400).json({
        status: 'FAIL',
        message: 'Invalid product_name'
      });
    }
    query = { product_name: req.body.product_name };
  } else {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Provide _id or product_name'
    });
  }

  Product.findOne(query)
    .then(product => {
      if (product) {
        return res.status(200).json({
          status: 'OK',
          data: product
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Product not found'
        })
      }
    })
    .catch(error => {
      return res.status(400).json({
        status: 'FAIL',
        message: error.message
      })
    });
});

// Get product
router.get('/:product', function (req, res, next) {
  var product_id = req.params.product;
  if (!isValidObjectId(product_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid product id'
    });
  }
  Product.findOne({
    _id: product_id
  })
    .then(product => {
      if (product) {
        return res.status(200).json({
          status: 'OK',
          data: product
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Product not found'
        })
      }
    })
    .catch(error => {
      return res.status(400).json({
        status: 'FAIL',
        message: error.message
      })
    });
});

// Update product
router.patch('/:product', function (req, res, next) {
  var product_id = req.params.product;
  if (!isValidObjectId(product_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid product id'
    });
  }

  if (hasOperatorKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var updates = pickAllowedProductFields(req.body || {});
  var updateValidationError = validateProductFields(updates, false);
  if (updateValidationError) {
    return res.status(400).json({
      status: 'FAIL',
      message: updateValidationError
    });
  }

  Product.findOneAndUpdate({
    _id: product_id
  }, updates, { runValidators: true })
    .then(product => {
      if (product) {
        return res.status(200).json({
          status: 'OK',
          message: 'Successfully updated'
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Product not found'
        })
      }
    })
    .catch(error => {
      return res.status(400).json({
        status: 'FAIL',
        message: error.message
      })
    });
});

// Delete product
router.delete('/:product', function (req, res, next) {
  var product_id = req.params.product;
  if (!isValidObjectId(product_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid product id'
    });
  }
  Product.deleteOne({
    _id: product_id
  })
    .then(product => {
      return res.status(200).json({
        status: 'OK',
        data: product
      });
    })
    .catch(error => {
      return res.status(400).json({
        status: 'FAIL',
        data: error.message
      })
    })
    ;
});

module.exports = router;
