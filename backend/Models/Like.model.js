const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  item_id: {
    type: String,
    required: true,
  },
  like: {
    type: Boolean,
  },
  dislike: {
    type: Boolean,
  },
  skipped: {
    type: Boolean,
  },
  isInPlaylist: [
    {
      type: String,
    },
  ],  
  type: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
