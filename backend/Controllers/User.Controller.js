const createError = require("http-errors");
const User = require("../Models/User.model");
const { getUserId } = require("../helpers/jwt_helper");

module.exports = {
  show: async (req, res, next) => {
    const user_id = await getUserId(req);
    const user = await User.findOne({ _id: user_id });
    if (!user) throw createError.NotFound("User not registered");
    res.send(user);
  },
  update: async (req, res, next) => {
    const user_id = await getUserId(req);
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { spotify_id: req.body.spotify_id },
      { new: true }
    );
    res.send(user);
  },
  getSpotifyId: async (req, res) => {
    const user_id = await getUserId(req);
    const user = await User.findOne({ _id: user_id });
    if (!user) throw createError.NotFound("User not registered");
    res.send({ spotify_id: user.spotify_id });
  },
};
