const Slot = require('../models/slot');

const slotsRepository = {};

slotsRepository.findOne = async(options) => {
  return Slot.findOne(options);
};

slotsRepository.findByIdAndUpdate = async(id, data) => {
  return Slot.findByIdAndUpdate(id, data);
};

slotsRepository.find = async(options) => {
  return await Slot.find(options);
};

slotsRepository.saveNew = async(_slot) => {
  const newSlot = new Slot({ ..._slot });
  return await newSlot.save();
};

module.exports = slotsRepository;
