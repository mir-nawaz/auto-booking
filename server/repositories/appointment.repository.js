const Appointment = require('../models/appointment');

const appointmentRepo = {};

appointmentRepo.findOne = async(options) => {
  return Appointment.findOne(options);
};

appointmentRepo.find = async(options) => {
  return await Appointment.find(options);
};

appointmentRepo.findByIdAndUpdate = async(id, data) => {
  return Appointment.findByIdAndUpdate(id, data);
};

appointmentRepo.saveNew = async(_appointment) => {
  const newAppointment = new Appointment({ ..._appointment });
  return await newAppointment.save();
};

module.exports = appointmentRepo;
