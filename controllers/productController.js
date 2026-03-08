const path = require("path");

exports.getProducts = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "data", "products.json"));
};