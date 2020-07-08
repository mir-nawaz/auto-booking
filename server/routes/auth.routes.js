const express = require('express');
const { check, param } = require('express-validator');

const Auth = require('../controllers/auth.controller');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');
const { wrap } = require('../middlewares/asycn.error.handler');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'You are in the Auth Endpoint. Register or Login to test Authentication.' });
});

router.post('/register', [
  check('email').isEmail().withMessage('Enter a valid email address'),
  check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
  check('firstName').not().isEmpty().withMessage('first name is required'),
  check('lastName').not().isEmpty().withMessage('last name is required'),
  check('role').not().isEmpty().isIn(['buyer', 'seller']).withMessage('role is required')
], validate, wrap(Auth.register));

router.post('/login', [
  check('email').isEmail().withMessage('Enter a valid email address'),
  check('password').not().isEmpty()
], validate, wrap(Auth.login));

// EMAIL Verification
router.get('/verify/:token', [
  param('token').not().isEmpty().withMessage('We were unable to find a user for this token.')
],
validate, wrap(Auth.verify));

router.post('/resend', wrap(Auth.resendToken));

// Password RESET
router.post('/recover', [
  check('email').isEmail().withMessage('Enter a valid email address')
], validate, wrap(Password.recover));

router.get('/reset/:token', wrap(Password.reset));

router.post('/reset/:token', [
  check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => (value === req.body.password))
], validate, wrap(Password.resetPassword));

module.exports = router;
