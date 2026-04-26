const Contact = require("../models/Contact");

exports.saveContact = async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    await newMessage.save();

    res.status(201).json({
      message: "Message saved in MongoDB successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};