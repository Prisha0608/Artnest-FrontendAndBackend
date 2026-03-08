const fs = require("fs");

const filePath = "./data/artworks.json";

exports.uploadArtwork = (req, res) => {

  const { username, title, price } = req.body;

  const newArtwork = {
    id: Date.now(),
    username,
    title,
    price,
    image: `/uploads/${req.file.filename}`
  };

  let artworks = [];

  if (fs.existsSync(filePath)) {
    artworks = JSON.parse(fs.readFileSync(filePath));
  }

  artworks.push(newArtwork);

  fs.writeFileSync(filePath, JSON.stringify(artworks, null, 2));

  res.json({ message: "Artwork uploaded successfully!" });
};

