const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes
router.get("/userDetails", userController.getUser);
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/profile", userController.updateProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;