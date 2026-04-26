const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, subscriptionController.subscribeArtist);

module.exports = router;