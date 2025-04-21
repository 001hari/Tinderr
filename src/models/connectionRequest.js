const { Schema, model } = require("mongoose");

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",

    required: true,
  },

  toUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["accepted", "rejected", "ignored", "interested"],
  },
});

const connectionRequestModel = model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
