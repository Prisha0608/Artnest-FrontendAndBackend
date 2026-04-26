const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/userDetails", userController.getUser);
router.post("/signup", userController.registerUser);
router.get("/login", userController.loginUser);
router.post("/profile", userController.updateProfile);

module.exports = router;