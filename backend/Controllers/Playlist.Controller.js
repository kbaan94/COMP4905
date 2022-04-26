const Playlist = require("../Models/Playlist.model");
const { getUserId } = require("../helpers/jwt_helper");

module.exports = {
  update: async (req, res, next) => {
    const user_id = await getUserId(req);

    const _user_id = await Playlist.find({
      user: user_id,
    });

    if (_user_id.length > 0) {
      Playlist.findOneAndUpdate(
        { user: user_id },
        { playlist_id: req.body.playlist_id },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } else {
      var _playlist = new Playlist({
        user: user_id,
        playlist_id: req.body.playlist_id,
      });

      await _playlist.save();
      res.send(_playlist);
    }
  },
  show: async (req, res) => {
    const user_id = await getUserId(req);
    const _playlist = await Playlist.find({
      user: user_id,
    });
    // console.log(like);
    res.send(_playlist);
  },
};
