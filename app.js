/**
 * Created by Syed Afzal
 */

require('dotenv').config();
require('./server/config/config');

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { log } = require('./server/utils/logger');
const db = require('./server/db');

const app = express();

// Log requests to the console.
app.use(logger('dev'));

app.use(cors());

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// connection from db here
db.connect(app);

//  adding routes
require('./server/routes')(app);

// initialize passport middleware
app.use(passport.initialize());
require('./server/middlewares/jwt')(passport);

// global error handler
app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

app.on('ready', () => {
  app.listen(3000, () => {
    // log.info('Environment : ', process.env.Environment);
    log.info('Server is up on port : ', 3000);
  });
});

module.exports = app;
