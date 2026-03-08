const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add-to-cart", cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/clear-cart", cartController.clearCart);
router.delete("/remove-from-cart/:index", cartController.removeFromCart);

module.exports = router;