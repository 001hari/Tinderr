const validator = require("validator");

const validatepassword = (password) => {
  //all this is done in databse level
  //lets add validation for strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password ");
  }
}

module.exports = {
  validatepassword,
}