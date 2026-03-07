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
const cors = require("cors");
app.use(cors());

// Json file paths
const usersFile = "./data/users.json";

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
  const {username, title, price } = req.body;

  const newArtwork = {
    id: Date.now(),
    username,
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
  const filePath = "./data/users.json";
  if (!fs.existsSync(filePath)) {
    return res.json({});
  }
  const profile = JSON.parse(fs.readFileSync(filePath));
  res.json(profile);
});

app.post("/profile", (req, res) => {
  const { username, fullname, bio ,social,email } = req.body;
  const filePath = "./data/users.json";
  if (!fs.existsSync(usersFile)) {
    return res.status(404).json({ message: "Users file not found" });
  }

  let users = JSON.parse(fs.readFileSync(usersFile));

  const userIndex = users.findIndex(user => user.username === username);
 
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // update profile fields
  users[userIndex].fullname = fullname;
  users[userIndex].bio = bio;
  users[userIndex].contact= email;
  users[userIndex].social = social;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({
    message: "Profile updated successfully",
    user: users[userIndex]
  });

});
app.get("/users", (req, res) => {

  if (!fs.existsSync(usersFile)) {
    return res.json([]);
  }

  const users = JSON.parse(fs.readFileSync(usersFile));

  if (req.query.username) {
    const filtered = users.filter(
      user => user.username === req.query.username
    );
    return res.json(filtered);
  }

  res.json(users);

});
app.post("/users", (req, res) => {
  let users = [];

  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  users.push(req.body);

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({ message: "User registered successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});