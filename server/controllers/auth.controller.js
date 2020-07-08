const User = require('../models/user');
const Token = require('../models/token');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const serverResponse = require('../utils/server.responses');
const messages = require('../utils/server.messages');
const { sendEmail } = require('../utils/send.email');

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async(req, res) => {
  const result = await authService.register(req.body);
  if (result.response.code === 200) {
    await sendVerificationEmail(result.user, req, res);
    return serverResponse.sendSuccess(res, result.response);
  }
  return serverResponse.sendSuccess(res, result.response, result.data);

};

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async(req, res) => {

  const data = req.body;
  const result = await authService.login(data);
  if (result.response.code === 200) {
    return serverResponse.sendSuccess(res, result.response, result.data);
  }
  return serverResponse.sendError(res, result.response);

};

// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
exports.verify = async(req, res) => {
  // if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

  // Find a matching token
  const token = await Token.findOne({ token: req.params.token });

  if (!token) {return serverResponse.sendError(res, messages.TOKEN_NOT_FOUND);}

  // If we found a token, find a matching user
  let user = await userService.findOne({ _id: token.userId });

  // check if user is not found
  if (!user) {return serverResponse.sendError(res, messages.USER_NOT_FOUND_WITH_THIS_TOKEN);}
  if (user.isVerified) {return serverResponse.sendError(res, messages.USER_IS_ALREADY_VERIFIED);}

  // Verify and save the user
  user.isVerified = true;
  return user.save(function(err) {
    if (err) return res.status(500).json({ message: err.message });

    return res.status(200).send('The account has been verified. Please log in.');
  });
};

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async(req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

    if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.' });

    await sendVerificationEmail(user, req, res);
    return res.status(200).json({ message: 'A token is sent to ' + user.email + '.' });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function sendVerificationEmail(user, req, res) {
  const token = user.generateVerificationToken();

  // Save the verification token
  await token.save();

  let subject = 'Account Verification Token';
  let to = user.email;
  let from = process.env.FROM_EMAIL;
  let link = 'http://' + req.headers.host + '/api/auth/verify/' + token.token;
  let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
              <br><p>If you did not request this, please ignore this email.</p>`;

  await sendEmail({ to, from, subject, html });
}
