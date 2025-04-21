const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.userId;
      const fromUserId = req.user._id;

      const isStatusValid = ["interested", "ignored"].includes(status);
      console.log("Status Valid:", isStatusValid);

      if (!isStatusValid) {
        return res
          .status(400)
          .send("Status must be either 'interested' or 'ignored'");
      }

      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).send("Can't Send status To Yourself");
      }

      const isValidObjectId = mongoose.Types.ObjectId.isValid(toUserId);
      if (!isValidObjectId) {
        return res.status(400).send("Invalid user ID format");
      }

      const toUser = await User.findOne({ _id: toUserId });
      console.log("User found:", toUser);

      const alredyHaveaStatus = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { toUserId, fromUserId },
        ],
      });

      if (alredyHaveaStatus) {
        return res.status(403).send("can't send status to the from User");
      }

      if (!toUser) {
        return res.status(404).send("User not found with the provided ID");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.status(201).send("Connection request sent successfully");
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
