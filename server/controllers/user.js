const User = require('../models/user');
const { log } = require('../utils/logger');
const role = require('../utils/enum').role;

const LIMIT = 10;
const SKIP = 0;

// @route GET api/user
// @desc Returns all users
// @access Public
exports.index = async function(req, res) {
  log.info('user - search start ');

  let { username, skip, limit } = req.query;
  skip = Number(skip) || SKIP;
  limit = Number(limit) || LIMIT;
  let query = { role: role.seller };
  if (username) {query.username = username;}

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort('firstName')
    .select('-isVerified -password -__v -createdAt -updatedAt');

  log.info('user - search complete');
  res.status(200).json({ total, skip, limit, users });
};
