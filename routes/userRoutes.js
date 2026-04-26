// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");

// router.get("/userDetails", userController.getUser);
// router.post("/signup", userController.registerUser);
// router.get("/login", userController.loginUser);
// router.post("/profile", userController.updateProfile);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.use((req, res, next) => {
  console.log("User route hit:", req.method, req.url);
  next();
});

// Get all users OR filter by username
router.get("/", userController.getUser);

// Register new user
router.post("/signup", userController.registerUser);

// Login user
router.get("/login", userController.loginUser);

// Update profile
router.post("/profile", userController.updateProfile);

module.exports = router;