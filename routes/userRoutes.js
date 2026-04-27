const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const sessionAuth = require("../middleware/sessionAuth");
router.get("/profile-session", sessionAuth, userController.getSessionUser);
router.get("/userDetails", userController.getUser);
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/profile", sessionAuth, userController.updateProfile);

module.exports = router;