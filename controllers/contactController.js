const prisma = require("../database/prisma");

exports.saveContact = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      message,
    } = req.body;

    await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        message,
      },
    });

    res.status(201).json({
      message: "Message saved successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};