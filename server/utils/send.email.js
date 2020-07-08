const sgMail = require('@sendgrid/mail');
const { log } = require('../utils/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      if (error) {
        log.error('email send error', error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};
module.exports = { sendEmail };
