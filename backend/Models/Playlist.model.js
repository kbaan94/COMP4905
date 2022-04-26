const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  playlist_id: [
    {
      type: String,
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
