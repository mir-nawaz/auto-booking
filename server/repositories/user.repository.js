const User = require('../models/user');

const usersRepository = {};

usersRepository.findOne = async(options) => {
  return User.findOne(options);
};

usersRepository.findUnique = async(options) => {
  return User.findOne({
    $or: [
      { email: options.email },
      { username: options.username }
    ]
  });
};

usersRepository.find = async(options) => {
  return await User.find(options);
};

usersRepository.saveNewUser = async(user) => {
  const newUser = new User({ ...user });
  return await newUser.save();
};

module.exports = usersRepository;
