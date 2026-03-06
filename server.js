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

// Selya JSON FILE PATH
const cartFile = "./data/cart.json";

const contactsFile = "./data/contacts.json";

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

//Selya


// Add item to cart
app.post("/add-to-cart", (req, res) => {

  const { name, price, img } = req.body;

  let cart = [];

  if (fs.existsSync(cartFile)) {
    try {
      cart = JSON.parse(fs.readFileSync(cartFile, "utf-8"));
    } catch (err) {
      cart = [];
    }
  }

  cart.push({ name, price, img });

  fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));

  res.json({
message: "Item added to cart",
cartLength: cart.length
});
});


// Get cart items
app.get("/cart", (req, res) => {

  let cart = [];

  if (fs.existsSync(cartFile)) {
    try {
      cart = JSON.parse(fs.readFileSync(cartFile, "utf-8"));
    } catch (err) {
      cart = [];
    }
  }

  res.json(cart);
});


// Clear whole cart
app.delete("/clear-cart", (req, res) => {

  fs.writeFileSync(cartFile, JSON.stringify([], null, 2));

  res.json({ message: "Cart cleared" });
});


// Remove particular item
app.delete("/remove-from-cart/:index", (req, res) => {

  const index = parseInt(req.params.index);

  let cart = [];

  if (fs.existsSync(cartFile)) {
    try {
      cart = JSON.parse(fs.readFileSync(cartFile, "utf-8"));
    } catch (err) {
      cart = [];
    }
  }

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
  }

  fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));

  res.json({ message: "Item removed" });
});

app.get("/login", (req, res) => {

  const { login, password } = req.query;

  fs.readFile(usersFile, "utf8", (err, data) => {

    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    const users = JSON.parse(data || "[]");

    const user = users.find(
      (u) =>
        (u.username === login || u.contact === login) &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid username/contact or password" });
    }

    res.json(user);

  });
});

// Save contact form messages
app.post("/contacts", (req, res) => {

  let contacts = [];

  if (fs.existsSync(contactsFile)) {
    contacts = JSON.parse(fs.readFileSync(contactsFile));
  }

  const newMessage = {
    id: Date.now(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  };

  contacts.push(newMessage);

  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

  res.json({ message: "Message saved successfully" });

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//ARTIST SUBSCRIPTION



const fs=require("fs");

// endpoint for subscription
app.post("/subscribe", (req, res) => {

    const { fullname, email, payment } = req.body;

    const newUser = {
        fullname: fullname,
        email: email,
        payment: payment,
        date: new Date()
    };

    let data = [];

    if (fs.existsSync("subscriptions.json")) {
        const fileData = fs.readFileSync("subscriptions.json");
        data = JSON.parse(fileData);
    }

    data.push(newUser);

    fs.writeFileSync("subscriptions.json", JSON.stringify(data, null, 2));

    res.send("Subscription saved successfully!");

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});