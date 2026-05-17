const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

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

// View Engine
app.set("view engine", "ejs");
app.set("views", "./views");

// EJS Route
app.get("/home-ejs", (req, res) => {
  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  res.render("home", { greeting });
});

// Optional DNS Fix
dns.setServers(["1.1.1.1", "1.0.0.1"]);

// Middleware
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 5, // 5 minutes
      httpOnly: true,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// Static Files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/users", userRoutes);
app.use("/artworks", artworkRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);
app.use("/contacts", contactRoutes);
app.use("/subscribe", subscriptionRoutes);

// Error Handler (MUST BE LAST)
app.use(errorHandler);

// Database Connection + Server Start
async function startServer() {
  try {
    await prisma.$connect();

    console.log("PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database Connection Failed:", error);
    process.exit(1);
  }
}

startServer();