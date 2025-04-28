const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validatepassword } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validatepassword(req.body.password);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      skills,
      phoneNumber,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      skills,
      phoneNumber,
    });
    await user.save();
    res.send("successfully signup ");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: "Email already in use!" });
    }
    res.status(500).send({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const hashPassword = await user.getPassword(password);

    if (hashPassword) {
      const token = user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      res.send({
        message: "Login Successful",
        user,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfull");
});

module.exports = authRouter;
