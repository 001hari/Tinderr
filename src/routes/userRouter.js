const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");

userRouter.get("/user/feed", userAuth, async (req, res) => {
  const userId = req.user._id;
  console.log("feed is seen by ", userId);
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR", err.msg);
  }
});

module.exports = userRouter;
