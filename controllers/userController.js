const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getSessionUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching session user",
      error: error.message
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    // CASE 1: signup check (no token)
    if (req.query.username) {
      const user = await User.find({ username: req.query.username });
      return res.json(user);
    }

    // CASE 2: protected profile (token required)
    if (req.user) {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ user });
    }

    return res.status(400).json({ message: "Invalid request" });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user(s)",
      error: error.message
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, contact, password, role, fullname, bio, social } = req.body;

    const existingUser = await User.findOne({ contact });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

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
      $or: [{ username: login }, { contact: login }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ ADD THIS (SESSION CREATE)
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    // (JWT can stay — optional)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: req.session.user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Something went wrong on server" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    // session check
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const { fullname, bio, social, contact } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      {
        fullname: fullname?.trim() || "",
        bio: bio?.trim() || "",
        social: social?.trim() || "",
        contact: contact?.trim() || ""
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log("Profile Update Error:", error);

    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};