const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const { validatepassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("login page");
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    res.send(user);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const userId = req.user._id;
  const data = req.body;

  try {
    const allowedUpdates = ["firstName", "lastName", "skills", "phoneNumber","photoURL"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data);
    await user.save();
    res.send(user.firstName + " updated successfully");
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const password = req.body.password;
    validatepassword(password);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashPassword },
      {
        new: true,
        returnDocument: "after",
        runValidators: true,
      }
    );
    res.send(`${user.firstName} password changed successfully`);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

module.exports = profileRouter;
