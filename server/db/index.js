/**
 * Created by Syed Afzal
 */
const mongoose = require('mongoose');
const { log } = require('../utils/logger');

exports.connect = (app) => {
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

  const connectWithRetry = () => {
    mongoose.Promise = global.Promise;
    // eslint-disable-next-line
    console.log('MongoDB connection with retry');
    mongoose
      .connect(process.env.MONGODB_URI, options)
      .then(() => {
        log.info('MongoDB is connected');
        app.emit('ready');
      })
      .catch((err) => {
        log.info('MongoDB connection unsuccessful, retry after 2 seconds.' + err);
        setTimeout(connectWithRetry, 2000);
      });
  };
  connectWithRetry();
};
