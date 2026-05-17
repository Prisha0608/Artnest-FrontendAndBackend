const prisma = require("../database/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= GET SESSION USER =================

exports.getSessionUser = async (req, res) => {
  try {

    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.session.user.id)
      },

      select: {
        id: true,
        username: true,
        contact: true,
        role: true,
        fullname: true,
        bio: true,
        social: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({ user });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching session user",
      error: error.message
    });
  }
};


// ================= GET USER =================

exports.getUser = async (req, res) => {
  try {

    // CASE 1: signup check (no token)
    if (req.query.username) {

      const user = await prisma.user.findMany({
        where: {
          username: req.query.username
        },

        select: {
          id: true,
          username: true,
          contact: true,
          role: true,
          fullname: true,
          bio: true,
          social: true,
          createdAt: true
        }
      });

      return res.json(user);
    }

    // CASE 2: protected profile (token required)
    if (req.user) {

      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.user.id)
        },

        select: {
          id: true,
          username: true,
          contact: true,
          role: true,
          fullname: true,
          bio: true,
          social: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      return res.json({ user });
    }

    return res.status(400).json({
      message: "Invalid request"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching user(s)",
      error: error.message
    });
  }
};


// ================= REGISTER USER =================

exports.registerUser = async (req, res) => {
  try {

    const {
      username,
      contact,
      password,
      role,
      fullname,
      bio,
      social
    } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        contact
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        contact,
        password: hashedPassword,
        role,
        fullname,
        bio,
        social
      }
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        contact: newUser.contact,
        role: newUser.role,
        fullname: newUser.fullname,
        bio: newUser.bio,
        social: newUser.social,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};


// ================= LOGIN USER =================

exports.loginUser = async (req, res) => {
  try {

    const { login, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: login },
          { contact: login }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // SESSION CREATE
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token,

      user: {
        id: user.id,
        username: user.username,
        contact: user.contact,
        role: user.role,
        fullname: user.fullname,
        bio: user.bio,
        social: user.social,
        createdAt: user.createdAt
      }
    });

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Something went wrong on server"
    });
  }
};


// ================= UPDATE PROFILE =================

exports.updateProfile = async (req, res) => {
  try {

    // Session check
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const {
      fullname,
      bio,
      social,
      contact
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(req.session.user.id)
      },

      data: {
        fullname: fullname?.trim() || "",
        bio: bio?.trim() || "",
        social: social?.trim() || "",
        contact: contact?.trim() || ""
      },

      select: {
        id: true,
        username: true,
        contact: true,
        role: true,
        fullname: true,
        bio: true,
        social: true,
        createdAt: true
      }
    });

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