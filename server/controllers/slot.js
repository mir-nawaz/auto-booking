const slotsRepo = require('../repositories/slot.repository');
const Slot = require('../models/slot');
const { log } = require('../utils/logger');
const msg = require('../utils/server.messages');

const LIMIT = 10;
const SKIP = 0;

// @route GET api/slot
// @desc Returns all slots
// @access private
exports.index = async function(req, res) {
  log.info('slot - search start ');

  let { sellerId, skip, limit, status } = req.query;
  skip = Number(skip) || SKIP;
  limit = Number(limit) || LIMIT;
  let query = {};
  if (sellerId) {query.sellerId = sellerId;}
  if (sellerId) {query.status = status;}

  const total = await Slot.countDocuments(query);
  const users = await Slot.find(query)
    .skip(skip)
    .limit(limit)
    .sort('createdAt')
    .select('-__v -createdAt -updatedAt');

  log.info('slot - search complete');
  res.status(200).json({ total, skip, limit, users });
};

// @route POST api/slot
// @desc save slot
// @access private
exports.store = async function(req, res) {
  log.info('slot - save start ');

  const data = req.body;
  data.sellerId = req.user._id;
  const slot = await slotsRepo.saveNew(data);
  const response = msg.SLOT_CREATED;
  const message = {
    ...response,
    slot
  };

  log.info('slot - save complete');
  res.status(response.code).json({ ...message });
};
