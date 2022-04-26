const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playedSongsSchema = new Schema({
  played_songs: [
    {
      type: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const playedSongs = mongoose.model("playedSongs", playedSongsSchema);
module.exports = playedSongs;
