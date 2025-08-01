var jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not available!!!!");
    }
    const decoded = jwt.verify(token, "DevTinder@123");

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not available");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
