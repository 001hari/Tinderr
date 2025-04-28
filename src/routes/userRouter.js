const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const userInfo = "firstName lastName email gender photoURL skills";

userRouter.get("/user/request/receive", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate({
      path: "fromUserId",
      select: userInfo,
    });

    if (connectionRequest.length === 0) {
      return res.status(400).send("No connection Req Availaiable");
    }
    const cleanUsers = connectionRequest.map((req) => req.fromUserId);
    res.json(cleanUsers);
  } catch (err) {
    console.log(err.message);
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
      status: "accepted",
    }).populate({
      path: "fromUserId toUserId",
      select: userInfo,
    });

    const connectedUsers = connections.map((conn) => {
      return conn.fromUserId._id.toString() === userId.toString()
        ? conn.toUserId
        : conn.fromUserId;
    });
    res.send(connectedUsers);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    const connectedUserIds = connections.map((conn) =>
      conn.fromUserId.toString() === userId.toString()
        ? conn.toUserId
        : conn.fromUserId
    );

    connectedUserIds.push(userId);

    const nonConnectedUsers = await User.find({
      _id: { $nin: connectedUserIds },
    }).select(userInfo);

    res.send(nonConnectedUsers);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ERROR: err.message});
  }
});

module.exports = userRouter;
