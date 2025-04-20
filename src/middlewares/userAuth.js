const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    const verified = jwt.verify(token, "DevTinder@Hari");
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid or expired token." });
  }
};

module.exports = {
  userAuth,
};