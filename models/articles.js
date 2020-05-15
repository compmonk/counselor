const mongoose = require("mongoose");
<<<<<<< Updated upstream
=======
// var uuid = require("node-uuid");
// require("mongoose-uuid2")(mongoose);
>>>>>>> Stashed changes

const articlesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: mongoose.Schema.Types.String,
  text: mongoose.Schema.Types.String,
  html: mongoose.Schema.Types.String,
  keywords: mongoose.Schema.Types.Mixed,
  ratings: mongoose.Schema.Types.Mixed,
  cost: mongoose.Schema.Types.Number,
  read: mongoose.Schema.Types.Number,
  rating: mongoose.Schema.Types.Number,
  author: mongoose.Schema.Types.ObjectId,
});

const Articles123 = mongoose.model("articles", articlesSchema);
module.exports = Articles123;
