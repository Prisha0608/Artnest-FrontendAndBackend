module.exports = (req, res, next) => {
  const { name, price, img } = req.body;

  if (!name || !price || !img) {
    return res.status(400).json({
      error: "All fields (name, price, img) are required"
    });
  }

  next();
};