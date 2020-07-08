const appointmentRepo = require('../repositories/appointment.repository');
const slotRepo = require('../repositories/slot.repository');
const userRepo = require('../repositories/user.repository');
const Appointment = require('../models/appointment');
const { log } = require('../utils/logger');
const msg = require('../utils/server.messages');
const enums = require('../utils/enum');

const LIMIT = 10;
const SKIP = 0;

// @route GET api/slot
// @desc Returns all slots
// @access private
exports.index = async function(req, res) {
  log.info('appointment - search start ');

  const sellerId = req.user._id;
  let { skip, limit } = req.query;
  skip = Number(skip) || SKIP;
  limit = Number(limit) || LIMIT;
  let query = {};
  if (sellerId) {query.sellerId = sellerId;}

  const total = await Appointment.countDocuments(query);
  const users = await Appointment.find(query)
    .skip(skip)
    .limit(limit)
    .sort('createdAt')
    .select('-__v -createdAt -updatedAt');

  log.info('appointment - search complete');
  res.status(200).json({ total, skip, limit, users });
};

// @route POST api/slot
// @desc save slot
// @access private
exports.store = async function(req, res) {
  log.info('slot - save start ');

  const data = req.body;
  data.buyerId = req.user._id;

  const [slot, seller] = await Promise.all([
    slotRepo.findOne({ _id: data.slotId, status: enums.slotStatus.available }),
    userRepo.findOne({ _id: data.sellerId })
  ]);

  if (!slot) {
    const slotMsg = msg.SLOT_NOT_EXIST;
    return res.status(slotMsg.code).json({ ...slotMsg });
  }
  if (!seller) {
    const sellerMsg = msg.SELLER_NOT_EXIST;
    return res.status(sellerMsg.code).json({ ...sellerMsg });
  }

  const appointment = await appointmentRepo.saveNew(data);
  const response = msg.APPOINTMENT_CREATED;

  const message = {
    ...response,
    appointment
  };

  await slotRepo.findByIdAndUpdate(slot._id, { status: enums.slotStatus.pending });
  log.info('slot - save complete');
  return res.status(response.code).json({ ...message });
};

// @route Put api/slot
// @desc save slot
// @access private
exports.update = async function(req, res) {
  log.info('slot - update start ');

  const data = req.body;
  data.sellerId = req.user._id;

  let statuses = [enums.appointmentStatus.rejected, enums.appointmentStatus.accepted];
  if (!statuses.includes(data.status)) {
    const statusMsg = msg.STATUS_NOT_EXIST;
    return res.status(statusMsg.code).json({ ...statusMsg });
  }

  const _appointment = await appointmentRepo.findOne({ _id: data.id,
    status: enums.slotStatus.pending,
    sellerId: data.sellerId
  });

  if (!_appointment) {
    const appointmentMsg = msg.APPOINTMENT_NOT_EXIST;
    return res.status(appointmentMsg.code).json({ ...appointmentMsg });
  }

  await appointmentRepo.findByIdAndUpdate(_appointment._id, { status: data.status });
  const appointment = await appointmentRepo.findOne({_id: _appointment._id});
  const response = msg.APPOINTMENT_UPDATED;

  const message = {
    ...response,
    appointment
  };

  await slotRepo.findByIdAndUpdate(_appointment.slotId, { status: enums.slotStatus.taken });
  log.info('slot - save complete');
  return res.status(response.code).json({ ...message });
};
