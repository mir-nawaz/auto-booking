const userRepository = require('../repositories/user.repository');
const userService = {};

userService.findOne = async(options) => {
  return await userRepository.findOne(options);
};

userService.find = async(options) => {
  return await userRepository.find(options);
};

module.exports = userService;
