const Cart = require("../models/Cart");

// Add item
exports.addToCart = async (req, res, next) => {
  try {
    const item = await Cart.create(req.body);
    const count = await Cart.countDocuments();

    res.json({
      success: true,
      cartLength: count,
      item
    });
  } catch (err) {
    next(err);
  }
};

// Get cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.deleteMany();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Remove item
const mongoose = require("mongoose"); // add at top

exports.removeFromCart = async (req, res, next) => {
  try {
    const id = req.params.id;

    // ✅ check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ID"
      });
    }

    await Cart.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};