const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    startTime: mongoose.Schema.Types.Date,
    endTime: mongoose.Schema.Types.Date,
    isActive: mongoose.Schema.Types.Boolean,
    refreshToken: mongoose.Schema.Types.String,
    accessToken: mongoose.Schema.Types.String,
    expirationTime: mongoose.Schema.Types.Date,
});

module.exports = mongoose.model("sessions", sessionSchema);