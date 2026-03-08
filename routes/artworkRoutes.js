const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const artworkController = require("../controllers/artworkController");

router.post("/upload", upload.single("artwork"), artworkController.uploadArtwork);


module.exports = router;