const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Prisma
const prisma = require("./database/prisma");

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

app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 5,
    },
  })
);

// Optional DNS fix
dns.setServers(["1.1.1.1", "1.0.0.1"]);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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
app.use("/product", productRoutes);
app.use("/contacts", contactRoutes);
app.use("/subscribe", subscriptionRoutes);

// Error handler (MUST BE LAST)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();

    console.log("PostgreSQL Connected");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database Connection Failed ", error);
    process.exit(1);
  }
});