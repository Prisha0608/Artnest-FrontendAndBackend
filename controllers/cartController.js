const fs = require("fs");
const path = require("path");

const cartFile = path.join(__dirname, "..", "data", "cart.json");

// Add item
exports.addToCart = (req, res) => {

  const { name, price, img } = req.body;

  let cart = [];

  if (fs.existsSync(cartFile)) {
    try {
      cart = JSON.parse(fs.readFileSync(cartFile, "utf-8"));
    } catch {
      cart = [];
    }
  }

  cart.push({ name, price, img });

  fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));

  res.json({
    success: true,
    cartLength: cart.length
  });
};

// Get cart
exports.getCart = (req, res) => {

  let cart = [];

  if (fs.existsSync(cartFile)) {
    try {
      cart = JSON.parse(fs.readFileSync(cartFile, "utf-8"));
    } catch {
      cart = [];
    }
  }

  res.json(cart);
};

// Clear cart
exports.clearCart = (req, res) => {

  fs.writeFileSync(cartFile, JSON.stringify([], null, 2));

  res.json({ success: true });
};

// Remove item
exports.removeFromCart = (req, res) => {

  const index = parseInt(req.params.index);

  let cart = [];

  if (fs.existsSync(cartFile)) {
    cart = JSON.parse(fs.readFileSync(cartFile));
  }

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
  }

  fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));

  res.json({ success: true });
};