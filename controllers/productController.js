const prisma = require("../database/prisma");

// ================= ALL PRODUCTS =================

exports.getProducts = async (req, res) => {
  try {

    const data = await prisma.product.findMany();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};


// ================= CATEGORY FILTER =================

exports.getByCategory = async (req, res) => {
  try {

    const category = req.params.category;

    const data = await prisma.product.findMany({
      where: {
        category,
      },
    });

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};