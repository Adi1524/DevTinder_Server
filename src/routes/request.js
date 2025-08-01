const express = require("express");
const { userAuth } = require("../middleware/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Status does not match either interested or ignored");
      }

      const toUser = User.findById(toUserId);
      // if (!toUser) {
      //   throw new Error("User Not present");
      // }
      if (fromUserId.toString() === toUserId) {
        return res.status(400).send("You cannot send a request to yourself");
      }

      const connectionPresent = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionPresent) {
        throw new Error("connection already present!!");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const connectionData = await connectionRequest.save();

      res.json({
        message: "connection created successfully!!",
        connectionData,
      });
    } catch (error) {
      console.error("Caught error:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("status not allowed");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection reqeust " + status, data });
    } catch (error) {
      res.status(400).send("Error" + error.message);
    }
  }
);

module.exports = requestRouter;
