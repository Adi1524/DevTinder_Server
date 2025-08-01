const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/authMiddleware.js");
const { validateProfileEdit } = require("../utils/validations.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    console.log("user heres", req.user);
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit) {
      throw new Error("edit fields are wrong!!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({ data: loggedInUser });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = profileRouter;
