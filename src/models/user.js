const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email" + value);
        }
        if (value !== value.toLowerCase()) {
          throw new Error("Email must be in lowercase: " + value);
        }
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender req"],
    },
    skills: {
      type: [String],
      default: ["JS", "React"],
    },
    phoneNumber: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-IN")) {
          throw new Error("Give Valid Phone Number:" + value);
        }
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Give Valid Photo URL: " + value);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.getPassword = async function (password) {
  const user = this;
  const hashPassword = await bcrypt.compare(password, user.password);
  return hashPassword;
};

const userModule = mongoose.model("User", userSchema);

module.exports = userModule;
