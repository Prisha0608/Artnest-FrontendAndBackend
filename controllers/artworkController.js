// controllers/artworkController.js

const Artwork = require("../models/Artwork");

// ==================================
// POST /artworks/upload
// ==================================
exports.uploadArtwork = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const artwork = await Artwork.create({
      username: req.session.user.username,
      userId: req.session.user.id,
      title: title.trim(),
      price: Number(price),
      image: `/uploads/${req.file.filename}`
    });

    res.status(201).json({
      message: "Artwork uploaded successfully",
      artwork
    });

  } catch (error) {
    console.log("Upload Error:", error);

    res.status(500).json({
      message: "Server error during upload"
    });
  }
};
