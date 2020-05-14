const mongoose = require("mongoose");
//var uuid = require("node-uuid");
const axios=require("axios")
//require("mongoose-uuid2")(mongoose);

const coursesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.Number,
  userId: mongoose.Schema.Types.ObjectId,
  canvasUserId: mongoose.Schema.Types.Number,
  courseName: mongoose.Schema.Types.String,
  Assignments:mongoose.Schema.Types.Mixed
});

const courses = mongoose.model("courses", coursesSchema);
module.exports = courses;
