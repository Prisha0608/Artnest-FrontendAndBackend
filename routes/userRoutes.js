const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/userDetails",authMiddleware, userController.getUser);
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/profile", authMiddleware, userController.updateProfile);

module.exports = router;