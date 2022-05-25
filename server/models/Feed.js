import mongoose from "mongoose";
import { PhotoSchema } from "./Photo.js";
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
  name: {
    type: String,
    required: false,
  },

  photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],

  timestamp: {
    type: String,
    default: Date.now(),
  },
});

const Feed = mongoose.model("Feed", FeedSchema, "Feed");

export { Feed, FeedSchema };
export default Feed;
