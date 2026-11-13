var express = require('express');
var router = express.Router();
const Account = require('../models/Account');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasUnsafeKeys(obj) {
  if (!isPlainObject(obj)) return true;
  return Object.keys(obj).some(function (k) {
    return k.startsWith('$') || k.indexOf('.') !== -1;
  });
}

function asSafeString(value) {
  if (typeof value !== 'string') return null;
  var v = value.trim();
  return v.length ? v : null;
}

function asEmail(value) {
  var v = asSafeString(value);
  if (!v) return null;
  var lower = v.toLowerCase();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(lower) ? lower : null;
}

function isValidObjectId(value) {
  return typeof value === 'string' && /^[a-fA-F0-9]{24}$/.test(value);
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
  if (!isPlainObject(req.body) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var email = asEmail(req.body.email);
  var username = asSafeString(req.body.username);
  var full_name = asSafeString(req.body.full_name);
  var password = asSafeString(req.body.password);

  if (!email || !username || !full_name || !password) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid account data'
    });
  }

  Account.findOne({ email: email })
    .then(account => {
      if (!account) {
        Account.create({
          email: email,
          username: username,
          full_name: full_name,
          password: password
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
  if (!isPlainObject(req.body) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var email = asEmail(req.body.email);
  var password = asSafeString(req.body.password);

  if (!email || !password) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid lookup data'
    });
  }

  Account.findOne({ email: email, password: password })
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
  if (!isValidObjectId(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid account id'
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
  if (!isValidObjectId(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid account id'
    });
  }
  if (!isPlainObject(req.body) || hasUnsafeKeys(req.body)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid request payload'
    });
  }

  var updateData = {};
  var username = asSafeString(req.body.username);
  var full_name = asSafeString(req.body.full_name);
  var password = asSafeString(req.body.password);
  var email = asEmail(req.body.email);

  if (username) updateData.username = username;
  if (full_name) updateData.full_name = full_name;
  if (password) updateData.password = password;
  if (email) updateData.email = email;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'No valid fields to update'
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
  if (!isValidObjectId(user_id)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid account id'
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
