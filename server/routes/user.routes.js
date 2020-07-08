const express = require('express');
const { check } = require('express-validator');

const { wrap } = require('../middlewares/asycn.error.handler');
const User = require('../controllers/user');
const validate = require('../middlewares/validate');
const router = express.Router();

// INDEX
router.get('/', [
  check('skip').not().isEmpty().isInt({ gt: -1 }).withMessage('skip is positive numeric value required.'),
  check('limit').not().isEmpty().isInt({ gt: -1 }).withMessage('limit is positive numeric value required.')
], validate, wrap(User.index));

module.exports = router;
