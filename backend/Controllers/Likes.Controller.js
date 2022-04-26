const createError = require("http-errors");
const Like = require("../Models/Like.model");
const { getUserId } = require("../helpers/jwt_helper");

module.exports = {
  updateLike: async (req, res, next) => {
    const user_id = await getUserId(req);
    const like = await Like.find({
      item_id: req.body.item_id,
      type: req.body.type,
    });
    if (like.length > 0) {
      const like_u = await Like.findOneAndUpdate(
        { item_id: req.body.item_id, type: req.body.type },
        { like: req.body.like, dislike: req.body.dislike },
        { new: true }
      );
      res.send(like_u);
    } else {
      var lik = new Like({
        item_id: req.body.item_id,
        like: req.body.like,
        dislike: req.body.dislike,
        type: req.body.type,
        user: user_id,
        skipped: false,
      });
      const like_s = await lik.save();
      res.send(like_s);
    }
  },

  updateSkip: async (req, res, next) => {
    const user_id = await getUserId(req);
    const like = await Like.find({
      item_id: req.body.item_id,
    });
    if (like.length > 0) {
      const skip_u = await Like.findOneAndUpdate(
        { item_id: req.body.item_id },
        { skipped: req.body.skipped },
        { new: true }
      );
      res.send(skip_u);
    } else {
      var skip = new Like({
        item_id: req.body.item_id,
        skipped: req.body.skipped,
        user: user_id,
        like: false,
        dislike: false,
        type: "song",
      });
      const skip_s = await skip.save();
      res.send(skip_s);
    }
  },

  updateisInPlaylist: async (req, res, next) => {
    const user_id = await getUserId(req);

    const like = await Like.find({
      user: user_id,
      item_id: req.body.item_id,
    });

    if (like.length > 0) {
      Like.updateOne(
        { item_id: req.body.item_id },
        { $addToSet: { isInPlaylist: [req.body.playlist_id] } },
        function (err, result) {
          if (err) {
            res.send(err);
          }
        }
      );
      const _isInPlaylist = await Like.find({
        item_id: req.body.item_id,
      });
      res.send(_isInPlaylist);
    } else {
      var _like = new Like({
        user: user_id,
        item_id: req.body.item_id,
        isInPlaylist: [req.body.playlist_id],
        like: false,
        dislike: false,
        type: "song",
        skipped: false,
      });

      await _like.save();
      res.send(_like);
    }
  },

  show: async (req, res) => {
    const user_id = await getUserId(req);
    const like = await Like.find({
      item_id: req.params.id,
      type: req.params.type,
      user: user_id,
    });
    res.send(like);
  },
};
