var express = require('express');
var router = express.Router();
const Transaction = require('../models/Transaction');

function isString(value) {
  return typeof value === 'string';
}

function isValidOrderId(value) {
  return isString(value) && value.trim().length > 0 && value.trim().length <= 128;
}

function isValidCcNumber(value) {
  return isString(value) && /^\d{13,19}$/.test(value.trim());
}

function isValidCcExpirateDate(value) {
  return isString(value) && /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(value.trim());
}

function isValidCvv(value) {
  return isString(value) && /^\d{3,4}$/.test(value.trim());
}

router.get('/', function (req, res, next) {
  res.status(200);
  res.json({
    status: 'OK',
    app: 'PaymentService',
    version: 'v1.0.0'
  });
});

router.post('/pay/:order_id', function(req, res, next) {
  const order_id = req.params.order_id;
  const cc_number = req.body.cc_number;
  const cc_expirate_date = req.body.cc_expirate_date;
  const cc_cvv = req.body.cc_cvv;

  if (!isValidOrderId(order_id) || !isValidCcNumber(cc_number) || !isValidCcExpirateDate(cc_expirate_date) || !isValidCvv(cc_cvv)) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid payment input'
    });
  }

  const safeOrderId = order_id.trim();
  const safeCcNumber = cc_number.trim();
  const safeCcExpirateDate = cc_expirate_date.trim();
  const safeCcCvv = cc_cvv.trim();

  Transaction.findOne({
    order_id: safeOrderId
  })
  .then(result => {
    if (!result){
      return Transaction.create({
        order_id: safeOrderId,
        cc_number: safeCcNumber,
        cc_expirate_date: safeCcExpirateDate,
        cc_cvv: safeCcCvv
      }).then(doc => {
        return res.status(200).json({
          status: 'OK',
          data: doc
        });
      });
    } else {
      return res.status(400).json({
        status: 'FAIL',
        message: 'Your order already paid'
      });
    }
  })
  .catch(err => {
    return res.status(400).json({
      status: 'FAIL',
      message: err.message
    });
  });
});

module.exports = router;
