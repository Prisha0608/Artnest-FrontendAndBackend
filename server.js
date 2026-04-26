const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
// New changes done by Manureet 26 april
app.use(cors());

// ✅ ADD THIS
app.use((req, res, next) => {
  console.log("Request received:");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// mm

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/users", userRoutes);
app.use("/artworks", artworkRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/contacts", contactRoutes);
app.use("/subscribe", subscriptionRoutes);


// ✅ New changes done by Manureet 26 april
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Something went wrong" });
});
//mm

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});