const passport = require('passport');
const msg = require('../utils/server.messages');

module.exports = (role) => (req, res, next) => {

  role = role || [];

  passport.authenticate('jwt', function(err, user, info) {
    if (err) return next(err);

    if (role.length && !role.includes(user.role)) {
      return res.status(msg.AUTHENTICATION_FAILED.code).json(msg.AUTHENTICATION_FAILED);
    }

    if (!user) return res.status(401).json({ message: 'Unauthorized Access - No Token Provided!' });

    req.user = user;

    return next();

  })(req, res, next);
};
