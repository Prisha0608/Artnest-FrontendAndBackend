const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  category: String
}, { collection: "product" }); // MUST MATCH ATLAS

module.exports = mongoose.model("Product", productSchema);