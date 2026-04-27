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
exports.removeFromCart = async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};