var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/Account');

const ALLOWED_FIELDS = ['email', 'username', 'full_name', 'password'];

function hasUnsafeKeys(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return Object.keys(obj).some(key => key.startsWith('$') || key.includes('.'));
}

function pickAllowed(body, allowed) {
  const out = {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return out;
  allowed.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      out[key] = body[key];
    }
  });
  return out;
}

function hasOnlyAllowedAndSafeKeys(body, allowed) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const keys = Object.keys(body);
  if (keys.length === 0) return true;
  return keys.every(key => allowed.includes(key) && !key.startsWith('$') && !key.includes('.'));
}

router.get('/', function (req, res, next) {
  res.status(200);
  res.json({
    status: 'OK',
    app: 'AccountService',
    version: 'v1.0.0'
  });
});

// Create account
router.put('/', function (req, res, next) {
  if (!hasOnlyAllowedAndSafeKeys(req.body, ALLOWED_FIELDS) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  const createData = pickAllowed(req.body, ALLOWED_FIELDS);

  Account.findOne({ email: createData.email })
    .then(account => {
      if (!account) {
        Account.create({
          email: createData.email,
          username: createData.username,
          full_name: createData.full_name,
          password: createData.password
        }).then(doc => {
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
          message: 'Account already exists'
        })
      }
    })
});

// Find account
router.post('/', function (req, res, next) {
  if (!hasOnlyAllowedAndSafeKeys(req.body, ALLOWED_FIELDS) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  const filter = pickAllowed(req.body, ALLOWED_FIELDS);
  if (Object.keys(filter).length === 0) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  Account.findOne(filter)
    .then(account => {
      if (account) {
        return res.status(200).json({
          status: 'OK',
          data: account
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Account not found'
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

// Get account
router.get('/:user', function (req, res, next) {
  var user_id = req.params.user;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  Account.findOne({
    _id: user_id
  })
    .then(account => {
      if (account) {
        return res.status(200).json({
          status: 'OK',
          data: account
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Account not found'
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

// Update account
router.patch('/:user', function (req, res, next) {
  var user_id = req.params.user;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  if (!hasOnlyAllowedAndSafeKeys(req.body, ALLOWED_FIELDS) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  const updateData = pickAllowed(req.body, ALLOWED_FIELDS);
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  Account.findOneAndUpdate({
    _id: user_id
  }, updateData)
    .then(account => {
      if (account) {
        return res.status(200).json({
          status: 'OK',
          message: 'Successfully updated'
        });
      } else {
        return res.status(400).json({
          status: 'FAIL',
          message: 'Account not found'
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

// Delete account
router.delete('/:user', function (req, res, next) {
  var user_id = req.params.user;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid input'
    });
  }

  Account.deleteOne({
    _id: user_id
  })
    .then(account => {
      return res.status(200).json({
        status: 'OK',
        data: account
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
