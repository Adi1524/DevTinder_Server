const express = require("express");
const { userAuth } = require("../middleware/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const userConnections = await ConnectionRequestModel.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName skills about gender photoUrl"
    );

    res.json({ message: "users connections are as follows", userConnections });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName skiils about gender photoUrl")
      .populate("toUserId", "firstName lastName skiils about gender photoUrl");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    hideUserFromFeed.add(loggedUser._id.toString());

    const user = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select("firstName lastName age gender skills about photoUrl")
      .skip(skip)
      .limit(limit);

    res.json({ data: user });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

module.exports = userRouter;
