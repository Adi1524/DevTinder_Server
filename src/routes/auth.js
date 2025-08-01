const express = require("express");
const { validationSignUpData } = require("../utils/validations.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const authRouter = express.Router();
const User = require("../models/user.js");

authRouter.post("/signup", async (req, res) => {
  validationSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    await user.save();
    res.send("User saved successfully!!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const userAvailable = await User.findOne({ emailId: emailId }).exec();

  if (!userAvailable) {
    throw new Error("Email not available in the db");
  }

  try {
    const verified = await bcrypt.compare(password, userAvailable.password);

    const token = jwt.sign(
      { userId: userAvailable._id }, // payload
      "DevTinder@123",
      { expiresIn: "1d" }
    );

    if (verified) {
      res.cookie("token", token);
      res.send(userAvailable);
    }
    res.send("user not verified");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Your Logged Out!!");
});

module.exports = authRouter;
