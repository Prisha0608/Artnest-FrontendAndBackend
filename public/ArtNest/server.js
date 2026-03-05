const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// Serve your static HTML files
app.use(express.static(__dirname));

// Path to cart file
const cartFile = "cart.json";

// Read cart items
app.get("/cart", (req, res) => {
  fs.readFile(cartFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading cart" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Add item to cart
app.post("/cart", (req, res) => {
  fs.readFile(cartFile, "utf8", (err, data) => {
    const cart = data ? JSON.parse(data) : [];
    cart.push(req.body);
    fs.writeFile(cartFile, JSON.stringify(cart, null, 2), err => {
      if (err) return res.status(500).json({ message: "Error saving cart" });
      res.json({ message: "Item added to cart" });
    });
  });
});

// Remove item from cart
app.delete("/cart/:name", (req, res) => {
  fs.readFile(cartFile, "utf8", (err, data) => {
    let cart = JSON.parse(data || "[]");
    cart = cart.filter(item => item.name !== req.params.name);
    fs.writeFile(cartFile, JSON.stringify(cart, null, 2), err => {
      if (err) return res.status(500).json({ message: "Error deleting item" });
      res.json({ message: "Item removed" });
    });
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
