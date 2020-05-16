const mongoose = require("mongoose");

const sessionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  startTime: mongoose.Schema.Types.Date,
  endTime: mongoose.Schema.Types.Date,
  isActive: mongoose.Schema.Types.Boolean,
});

module.exports = mongoose.model("sessions", sessionsSchema);
