const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  userid: String,
  username: String,
  date: Date,
  duration: Number,
  description: String
});

const exerciseModel = new mongoose.model("exercise", exerciseSchema);

module.exports = exerciseModel;

