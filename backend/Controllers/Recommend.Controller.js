const Recommend = require("../Models/Recommend.model");
const { getUserId } = require("../helpers/jwt_helper");

module.exports = {
  update: async (req, res, next) => {
    const user_id = await getUserId(req);

    const _user_id = await Recommend.find({
      user: user_id,
    });

    if (_user_id.length > 0) {
      Recommend.findOneAndUpdate(
        { user: user_id },
        { $addToSet: { recommend_id: req.body } },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } else {
      var _recommend = new Recommend({
        user: user_id,
        recommend_id: req.body,
      });

      await _recommend.save();
      res.send(_recommend);
    }
  },
  show: async (req, res) => {
    const user_id = await getUserId(req);
    const _recommend = await Recommend.find({
      user: user_id,
    });
    // console.log(like);
    res.send(_recommend);
  },
};
