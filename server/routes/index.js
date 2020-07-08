const express = require('express');
const auth = require('./auth.routes');
const user = require('./user.routes');
const slot = require('./slot.routes');
const appointment = require('./appointment.routes');
const role = require('../utils/enum').role;
const authenticate = require('../middlewares/authenticate');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the auto-booking API. Register or Login to see magic in action.' });
  });

  // user routes
  router.use('/user', authenticate([role.buyer]), user);

  // slot routes
  router.use('/slot', slot);

  // appointment routes
  router.use('/appointment', appointment);

  // auth routes
  router.use('/auth', auth);

  // global prefix for routes api
  app.use('/api', router);
};
