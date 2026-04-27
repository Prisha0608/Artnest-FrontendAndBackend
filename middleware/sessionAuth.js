const sessionAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    return res.status(401).json({ message: "Not logged in (session)" });
  }
};

module.exports = sessionAuth;