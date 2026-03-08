const fs = require("fs");
const path = require("path");

const contactsFile = path.join(__dirname, "..", "data", "contacts.json");

exports.saveContact = (req, res) => {

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
};