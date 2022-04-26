const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecommendSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  recommend_id: [
    {
      type: String,
    },
  ],
});

const Recommend = mongoose.model("Recommend", RecommendSchema);
module.exports = Recommend;
