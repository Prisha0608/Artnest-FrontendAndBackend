const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET USERS (MongoDB)
exports.getUser = async (req, res) => {
  try {
    if (req.query.username) {
      const user = await User.find({ username: req.query.username });
      return res.json(user);
    }

    const users = await User.find();
    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, contact, password, role, fullname, bio, social } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ contact });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      contact,
      password: hashedPassword,
      role,
      fullname,
      bio,
      social,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: login },
        { contact: login }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        contact: user.contact,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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