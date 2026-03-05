const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("artwork"), (req, res) => {
  const { title, price } = req.body;

  const newArtwork = {
    id: Date.now(),
    title,
    price,
    image: `/uploads/${req.file.filename}`
  };

  let artworks = [];
  const filePath = "./data/artworks.json";

  if (fs.existsSync(filePath)) {
    artworks = JSON.parse(fs.readFileSync(filePath));
  }

  artworks.push(newArtwork);
  fs.writeFileSync(filePath, JSON.stringify(artworks, null, 2));

  res.json({ message: "Artwork uploaded successfully!" });
});

// Get artworks
app.get("/artworks", (req, res) => {
  const filePath = "./data/artworks.json";
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  const artworks = JSON.parse(fs.readFileSync(filePath));
  res.json(artworks);
});

// PROFILE ROUTES

app.get("/profile", (req, res) => {
  const filePath = "./data/profile.json";
  if (!fs.existsSync(filePath)) {
    return res.json({});
  }
  const profile = JSON.parse(fs.readFileSync(filePath));
  res.json(profile);
});

app.post("/profile", (req, res) => {
  const filePath = "./data/profile.json";
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ message: "Profile updated" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});