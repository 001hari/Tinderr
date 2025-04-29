const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send", userAuth, async (req, res) => {
  try {
    const status = req.body.status;
    const toUserId = req.body.userId;
    const fromUserId = req.user._id;

    const isStatusValid = ["interested", "ignored"].includes(status);

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

    if (!toUser) {
      return res.status(404).send("User not found with the provided ID");
    }

    const alredyHaveaStatus = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (alredyHaveaStatus) {
      return res.status(403).send("Already sent a req ");
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
});

requestRouter.post("/request/review", userAuth, async (req, res) => {
  try {
    const newStatus = req.body.status;

    const loggedInUserId = req.user._id;

    const VALID_REVIEW_STATUSES = ["accepted", "rejected"];
    if (!VALID_REVIEW_STATUSES.includes(newStatus)) {
      return res
        .status(400)
        .send("Status must be either 'accepted' or 'rejected'.");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      return res
        .status(404)
        .send(
          "No matching connection request found or not authorized to review."
        );
    }

    connectionRequest.status = newStatus;
    await connectionRequest.save();

    res.status(200).send("Request reviewed successfully.");
  } catch (err) {
    console.error("Error reviewing request:", err);
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = requestRouter;
