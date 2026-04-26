const Subscription = require("../models/Subscription");

exports.subscribeArtist = async (req, res, next) => {
  try {
    const { payment } = req.body;

    const userId = req.user.id;   // from JWT
    const email = req.user.email;

    const existing = await Subscription.findOne({ email });

    if (existing) {
      return res.json({ message: "Already subscribed" });
    }

    const newSub = await Subscription.create({
      userId,
      email,
      payment
    });

    res.json({
      success: true,
      data: newSub
    });

  } catch (err) {
    next(err);
  }
};