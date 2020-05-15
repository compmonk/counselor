const mongoose = require("mongoose");
//var uuid = require("node-uuid");
const axios=require("axios")
//require("mongoose-uuid2")(mongoose);

// const coursesSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.Number,
//   userId: mongoose.Schema.Types.ObjectId,
//   canvasUserId: mongoose.Schema.Types.Number,
//   courseName: mongoose.Schema.Types.String,
//   Assignments:mongoose.Schema.Types.Mixed
// });

const coursesSchema = mongoose.Schema({
  "id": mongoose.Schema.Types.Number,
  "UserID": mongoose.Schema.Types.ObjectId,
  "name": mongoose.Schema.Types.String,
  "account_id": mongoose.Schema.Types.Number,
  "uuid": mongoose.Schema.Types.String,
  "start_at": mongoose.Schema.Types.String,
  "grading_standard_id": mongoose.Schema.Types.Mixed,
  "is_public": mongoose.Schema.Types.Boolean,
  "created_at": mongoose.Schema.Types.String,
  "course_code": mongoose.Schema.Types.String,
  "default_view": mongoose.Schema.Types.String,
  "root_account_id": mongoose.Schema.Types.Number,
  "enrollment_term_id": mongoose.Schema.Types.Number,
  "license": mongoose.Schema.Types.String,
  "grade_passback_setting": mongoose.Schema.Types.Mixed,
  "end_at":  mongoose.Schema.Types.Mixed,
  "public_syllabus":  mongoose.Schema.Types.Mixed,
  "public_syllabus_to_auth":  mongoose.Schema.Types.Mixed,
  "storage_quota_mb": mongoose.Schema.Types.Number,
  "is_public_to_auth_users": mongoose.Schema.Types.Boolean,
  "apply_assignment_group_weights": mongoose.Schema.Types.Boolean,
  "calendar": mongoose.Schema.Types.Mixed,
  "time_zone": mongoose.Schema.Types.String,
  "blueprint": mongoose.Schema.Types.Boolean,
  "enrollments": mongoose.Schema.Types.Mixed,
  "hide_final_grades": mongoose.Schema.Types.Boolean,
  "workflow_state": mongoose.Schema.Types.String,
  "restrict_enrollments_to_course_dates": mongoose.Schema.Types.Boolean,
  "overridden_course_visibility": mongoose.Schema.Types.Mixed
});



const courses = mongoose.model("courses", coursesSchema);
module.exports = courses;
