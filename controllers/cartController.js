const prisma = require("../database/prisma");


// ================= ADD TO CART =================

exports.addToCart = async (req, res, next) => {
  try {

    const { name, price, img } = req.body;

    const item = await prisma.cart.create({
      data: {
        name,
        price: Number(price),
        img,
      },
    });

    const count = await prisma.cart.count();

    res.json({
      success: true,
      cartLength: count,
      item,
    });

  } catch (err) {
    next(err);
  }
};


// ================= GET CART =================

exports.getCart = async (req, res, next) => {
  try {

    const cart = await prisma.cart.findMany();

    res.json(cart);

  } catch (err) {
    next(err);
  }
};


// ================= CLEAR CART =================

exports.clearCart = async (req, res, next) => {
  try {

    await prisma.cart.deleteMany();

    res.json({
      success: true,
    });

  } catch (err) {
    next(err);
  }
};


// ================= REMOVE ITEM =================

exports.removeFromCart = async (req, res, next) => {
  try {

    const id = Number(req.params.id);

    // Prisma uses Int IDs
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid ID",
      });
    }

    await prisma.cart.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });

  } catch (err) {
    next(err);
  }
};