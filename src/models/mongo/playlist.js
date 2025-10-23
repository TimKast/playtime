import Mongoose from "mongoose";

const { Schema } = Mongoose;

const playlistSchema = new Schema({
  title: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Playlist = Mongoose.model("Playlist", playlistSchema);
