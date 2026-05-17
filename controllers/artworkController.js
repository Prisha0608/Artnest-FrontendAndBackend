const prisma = require("../database/prisma");

// ==================================
// POST /artworks/upload
// ==================================

exports.uploadArtwork = async (req, res) => {
  try {

    // Session check
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const { title, price } = req.body;

    // Validation
    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price required",
      });
    }

    // Image check
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    // Create artwork
    const artwork = await prisma.artwork.create({
      data: {
        username: req.session.user.username,
        title: title.trim(),
        price: Number(price),
        image: `/uploads/${req.file.filename}`,
      },
    });

    res.status(201).json({
      message: "Artwork uploaded successfully",
      artwork,
    });

  } catch (error) {

    console.log("Upload Error:", error);

    res.status(500).json({
      message: "Server error during upload",
      error: error.message,
    });
  }
};