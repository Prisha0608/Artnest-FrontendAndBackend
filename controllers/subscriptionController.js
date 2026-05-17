
const prisma = require("../database/prisma");

exports.subscribeArtist = async (req, res, next) => {
  try {

    const { payment } = req.body;

    // From JWT middleware
    const userId = req.user.id;
    const email = req.user.email;

    // Check existing subscription
    const existing = await prisma.subscription.findFirst({
      where: {
        email,
      },
    });

    if (existing) {
      return res.json({
        message: "Already subscribed",
      });
    }

    // Create subscription
    const newSub = await prisma.subscription.create({
      data: {
        userId: String(userId),
        email,
        payment,
      },
    });

    res.json({
      success: true,
      data: newSub,
    });

  } catch (err) {
    next(err);
  }
};

