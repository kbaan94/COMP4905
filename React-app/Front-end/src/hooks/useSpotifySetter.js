import { useDispatch, useSelector } from "react-redux";
import { setToken } from "actions/tokenActions";
import {
  fetchUser,
  // fetchTopTracks,
  fetchRecommendations,
  fetchPopularSongs,
  fetchPlaylist,
} from "actions/userActions";
const useSpotifySetter = () => {
  const dispatch = useDispatch();
  // const topTracks = useSelector((state) => state.topTracksReducer.topTracks);
  const setAll = () => {
    let data = JSON.parse(localStorage.getItem("spotify_token"));
    let authToken = JSON.parse(localStorage.getItem("auth"));
    dispatch(setToken(data));
    dispatch(fetchUser(data));
    dispatch(fetchRecommendations(data,authToken));
    dispatch(fetchPopularSongs(data));
    dispatch(fetchPlaylist(data,authToken));
    // dispatch(fetchTopTracks(data));
    // if (topTracks && topTracks.length > 0) {
    //   dispatch(
    //     fetchRecommendations(data, topTracks[0].artists[0].id, topTracks[0].id)
    //   );
    // } else {
    // }
  };
  const setUpdatedPlaylist = () => {
    let data = JSON.parse(localStorage.getItem("spotify_token"));
    let authToken = JSON.parse(localStorage.getItem("auth"));
    dispatch(fetchPlaylist(data,authToken));
  };
  const setUpdatedRecommendations = () => {
    let data = JSON.parse(localStorage.getItem("spotify_token"));
    let authToken = JSON.parse(localStorage.getItem("auth"));
    dispatch(fetchRecommendations(data,authToken));
  };
  return { setAll, setUpdatedPlaylist, setUpdatedRecommendations };
};
export default useSpotifySetter;
