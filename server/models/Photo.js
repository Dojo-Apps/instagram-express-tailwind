import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  instagramID: {
    type: Number,
    required: false,
  },
  mediaURL: {
    type: String,
    required: false,
  },
  mediaType: {
    type: String,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
    default: [],
  },
  instagramTimestamp: {
    type: String,
    reqired: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
  caption: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
});

const Photo = mongoose.model("Photo", PhotoSchema, "Photo");

export { Photo, PhotoSchema };
export default Photo;
