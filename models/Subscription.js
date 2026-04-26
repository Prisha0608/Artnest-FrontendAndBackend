const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: String,
  email: String,
  payment: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);