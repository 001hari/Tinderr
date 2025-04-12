const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstname: "Hari",
    lastName: "Pradhan",
    password: "Hari9876",
  });
  await user.save();
  res.send("user data upoaded");
});

connectDB()
  .then(() => {
    console.log("Database connected.... ");
    app.listen(3000, () => {
      console.log("Listing from server 3000 !!");
    });
  })
  .catch((err) => {
    console.log("unsu");
  });
