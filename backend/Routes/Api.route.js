const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const UserController = require("../Controllers/User.Controller");
const LikesController = require("../Controllers/Likes.Controller");
const playedSongsController = require("../Controllers/playedSongs.Controller");
const PlaylistController = require("../Controllers/Playlist.Controller");
const RecommendController = require("../Controllers/Recommend.Controller");

router.get("/show", verifyAccessToken, UserController.show);
// router.post('/')
router.put("/update_spotify_id", verifyAccessToken, UserController.update);
router.get("/spotify_id", verifyAccessToken, UserController.getSpotifyId);
router.post("/update_like", verifyAccessToken, LikesController.updateLike);
router.get("/spotify/:id/:type", verifyAccessToken, LikesController.show);

router.post("/update_skip", verifyAccessToken, LikesController.updateSkip);
router.post(
  "/update_isInPlaylist",
  verifyAccessToken,
  LikesController.updateisInPlaylist
);

router.post("/played_songs", verifyAccessToken, playedSongsController.update);
router.get("/show_played_songs", verifyAccessToken, playedSongsController.show);

router.post("/playlist", verifyAccessToken, PlaylistController.update);
router.get("/playlist", verifyAccessToken, PlaylistController.show);

router.post("/recommend", verifyAccessToken, RecommendController.update);
router.get("/recommend", verifyAccessToken, RecommendController.show);

module.exports = router;
