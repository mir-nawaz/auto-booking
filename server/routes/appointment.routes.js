const express = require('express');
const { check } = require('express-validator');
const authenticate = require('../middlewares/authenticate');
const role = require('../utils/enum').role;
const { wrap } = require('../middlewares/asycn.error.handler');
const Appointment = require('../controllers/appointment');
const validate = require('../middlewares/validate');
const router = express.Router();

// Appointment search
router.get('/', authenticate([role.seller]), [
  check('skip').not().isEmpty().isInt({ gt: -1 }).withMessage('skip is positive numeric value required.'),
  check('limit').not().isEmpty().isInt({ gt: -1 }).withMessage('limit is positive numeric value required.')
], validate, wrap(Appointment.index));

// Appointment create
router.post('/', authenticate([role.buyer]), [
  check('description').not().isEmpty().withMessage('description is required.'),
  check('slotId').not().isEmpty().isMongoId().withMessage('slotId is required.'),
  check('sellerId').not().isEmpty().isMongoId().withMessage('sellerId is required.')
], validate, wrap(Appointment.store));

// Appointment update
router.put('/', authenticate([role.seller]), [
  check('status').not().isEmpty().withMessage('status is required.'),
  check('id').not().isEmpty().isMongoId().withMessage('id is required.')
], validate, wrap(Appointment.update));

module.exports = router;
