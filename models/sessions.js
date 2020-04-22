const mongoose = require("mongoose");
var uuid = require("node-uuid");
require("mongoose-uuid2")(mongoose);

const sessionsSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.UUID, default: uuid.v5 },
  userId: { type: mongoose.Schema.Types.UUID, default: uuid.v5 },
  startTime: mongoose.Schema.Types.Date,
  endTime: mongoose.Schema.Types.Date,
  isActive: mongoose.Schema.Types.Boolean,
});

const Sessions123 = mongoose.model("sessions", sessionsSchema);
module.exports = Sessions123;
