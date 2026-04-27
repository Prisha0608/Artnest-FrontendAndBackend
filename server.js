const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("node:dns");

require("dotenv").config({ path: "./.env" });
console.log("ENV:", process.env.MONGO_URI);
const connectDB = require("./database/dbconnection");

// Routes
const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

// Middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Optional DNS fix
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares (GLOBAL)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/users", userRoutes);
app.use("/artworks", artworkRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/contacts", contactRoutes);
app.use("/subscribe", subscriptionRoutes);

// ERROR HANDLER (MUST BE LAST)
app.use(errorHandler);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
     
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  });