const mongoose = require('mongoose');
const status = require('../utils/enum').appointmentStatus;
const statuses = [status.accepted, status.rejected, status.pending];

const AppointmentSchema = new mongoose.Schema({
  description: {
    type: String,
    unique: true,
    required: 'description is required',
    trim: true
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slots',
    required: 'slotId is required'
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: 'buyerId is required'
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: 'sellerId is required'
  },

  status: {
    type: String,
    unique: true,
    required: 'status is required',
    enum: statuses,
    default: status.pending
  }

}, { timestamps: true });

AppointmentSchema.statuses = statuses;

module.exports = mongoose.model('Appointments', AppointmentSchema);
