const express = require('express');
const { check } = require('express-validator');
const authenticate = require('../middlewares/authenticate');
const role = require('../utils/enum').role;
const { wrap } = require('../middlewares/asycn.error.handler');
const Slot = require('../controllers/slot');
const validate = require('../middlewares/validate');
const router = express.Router();

// Slot search
router.get('/', authenticate([role.buyer]), [
  check('sellerId').not().isEmpty().isMongoId().withMessage('sellerId is required.'),
  check('status').not().isEmpty().withMessage('status is required.'),
  check('skip').not().isEmpty().isInt({ gt: -1 }).withMessage('skip is positive numeric value required.'),
  check('limit').not().isEmpty().isInt({ gt: -1 }).withMessage('limit is positive numeric value required.')
], validate, wrap(Slot.index));

// Slot create
router.post('/', authenticate([role.seller]), [
  check('fromDate').not().isEmpty().withMessage('fromDate is required.'),
  check('toDate').not().isEmpty().withMessage('toDate is required.')
], validate, wrap(Slot.store));

module.exports = router;
