import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { FeedSchema } from "./Feed.js";

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  shopOrigin: {
    type: String,
    required: false,
  },
  subscriptionID: {
    type: String,
    required: false,
  },
  subscriptionStatus: {
    type: String,
    required: false,
  },
  shopifyAccessToken: {
    type: String,
    required: false,
  },
  shopifyAccessTokenExpirationDate: {
    type: String,
    required: false,
  },

  instagramUserID: {
    type: String,
    required: false,
  },
  instagramAccessToken: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },

  lastSelectedFeedID: {
    type: String,
    required: false,
  },
  instagramUsername: {
    type: String,
    required: false,
  },
  feeds: [FeedSchema],
});

UserSchema.post("save", function (userJustGotSaved, next) {
  userJustGotSaved
    .populate({
      path: "feeds",
      populate: { path: "photos" },
    })
    .then(function () {
      next();
    });
});

const User = mongoose.model("User", UserSchema, "User");

export { User };
export default User;
