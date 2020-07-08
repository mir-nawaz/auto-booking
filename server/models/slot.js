const mongoose = require('mongoose');
const status = require('../utils/enum').slotStatus;
const statuses = [status.available, status.pending, status.taken];

const SlotSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: 'userId is required'
  },

  status: {
    type: String,
    unique: true,
    required: 'status is required',
    enum: statuses,
    default: status.available
  },

  toDate: {
    type: Date,
    required: 'toDate is required'
  },

  fromDate: {
    type: Date,
    required: 'fromDate is required'
  }
}, { timestamps: true });

SlotSchema.statuses = statuses;

module.exports = mongoose.model('Slots', SlotSchema);
