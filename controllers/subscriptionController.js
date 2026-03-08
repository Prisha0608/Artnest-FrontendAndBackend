const fs = require("fs");
const path = require("path");

const subsFile = path.join(__dirname, "..", "data", "subscriptions.json");

exports.subscribeArtist = (req, res) => {

  const { fullname, email, payment } = req.body;

  const newUser = {
    fullname,
    email,
    payment,
    date: new Date()
  };

  let data = [];

  if (fs.existsSync(subsFile)) {
    const fileData = fs.readFileSync(subsFile);
    data = JSON.parse(fileData);
  }

  data.push(newUser);

  fs.writeFileSync(subsFile, JSON.stringify(data, null, 2));

  res.json({ success: true });
};