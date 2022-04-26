const playedSongs = require("../Models/playedSongs.model");
const { getUserId } = require("../helpers/jwt_helper");

module.exports = {
  update: async (req, res, next) => {
    const user_id = await getUserId(req);

    const _user_id = await playedSongs.find({
      user: user_id,
    });

    if (_user_id.length > 0) {
      playedSongs.updateOne(
        { user: user_id },
        { $addToSet: { played_songs: [req.body.played_songs] } },
        function (err, result) {
          if (err) {
            res.send(err);
          }
        }
      );
      const _playedSongs = await playedSongs.find({
        user: user_id,
      });
      res.send(_playedSongs);
    } else {
      var _user = new playedSongs({
        user: user_id,
        played_songs: [req.body.played_songs],
      });

      await _user.save();
      res.send(_user);
    }
  },
  show: async (req, res) => {
    const user_id = await getUserId(req);
    // console.log(req.params.id, req.params.type);
    const _playedSongs = await playedSongs.find({
      user: user_id,
    });
    // console.log(like);
    res.send(_playedSongs);
  },
};
