const Product = require("../models/Product");

// ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CATEGORY FILTER
exports.getByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const data = await Product.find({ category });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};