console.log("stating new pro`")

const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("hello  fro 3000")
})

app.use(("/home", (req, res) => {
  res.send("home page");
}))

app.listen(3000, () => {
  console.log(":listing from server 3000")
})