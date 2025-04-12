const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
});

const userModule = mongoose.model("User", userScheme);

module.exports = userModule;
