const mongoose = require("mongoose");
var uuid = require("node-uuid");
require("mongoose-uuid2")(mongoose);

const coursesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.Number,
  userId: mongoose.Schema.Types.ObjectId,
  canvasUserName: mongoose.Schema.Types.Number,
  courseName: mongoose.Schema.Types.String,
  Assignments:mongoose.Schema.Types.Mixed
});

const Courses = mongoose.model("Courses", coursesSchema);
module.exports = Courses;