const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const validateCart = require("../middleware/validateCart");

router.post("/add-to-cart", validateCart, cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/clear-cart", cartController.clearCart);
router.delete("/remove-from-cart/:id", cartController.removeFromCart);

module.exports = router;