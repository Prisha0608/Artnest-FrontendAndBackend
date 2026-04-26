const bcrypt = require("bcrypt");

const fs = require("fs");

const usersFile = "./data/users.json";

exports.getUser = (req, res) => {

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
};

exports.registerUser = async (req, res) => {
  let users = [];

  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  try {
    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {

  const { login, password } = req.query;

  const users = JSON.parse(fs.readFileSync(usersFile));

  const user = users.find(
    (u) =>
      (u.username === login || u.contact === login)
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};exports.loginUser = async (req, res) => {

  const { login, password } = req.query;

  const users = JSON.parse(fs.readFileSync(usersFile));

  const user = users.find(
    (u) =>
      (u.username === login || u.contact === login)
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateProfile = (req, res) => {

  const { username, fullname, bio, social, email } = req.body;

  let users = JSON.parse(fs.readFileSync(usersFile));

  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex].fullname = fullname;
  users[userIndex].bio = bio;
  users[userIndex].contact = email;
  users[userIndex].social = social;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({
    message: "Profile updated",
    user: users[userIndex]
  });
};