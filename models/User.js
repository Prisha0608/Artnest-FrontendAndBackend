// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  contact: String,
  password: String,
  role: String,
  fullname: String,
  bio: String,
  social: String
});

module.exports = mongoose.model("User", userSchema);