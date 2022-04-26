import "./index.header.css";
import { useAuth, useSpotify, useSpotifySetter } from "all";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { setToken } from "actions/tokenActions";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  fetchTopTracks,
  fetchRecommendations,
} from "actions/userActions";

export default function Header() {
  const { getCurrentUser, logout } = useAuth();
  const dispatch = useDispatch();
  const spotifyToken = useSelector((state) => state.tokenReducer.token);
  const [storedSpotifyToken] = useState(
    JSON.parse(localStorage.getItem("spotify_token"))
  );
  const { setAll, setUpdatedPlaylist,setUpdatedRecommendations } = useSpotifySetter();

  const [nav, setNav] = useState("");

  const authorizeSpotify = () => {
    // a417fb58f6c84d0e83555b8137882a97
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&scope=user-read-email%20user-top-read%20user-read-private%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private%20playlist-read-private%20playlist-read-collaborative&response_type=code&redirect_uri=${window.location.origin}/callback`;
  };

  const handleLogout = () => {
    dispatch(setToken(""));
    logout();
  };

  const setNavGlower = () => {
    let location = window.location.pathname;
    switch (location) {
      case "/":
        setNav("home");
        break;
      case "/songs":
        setNav("songs");
        break;
      // case '/top':
      //   setNav('top')
      //   break;
      case "/recommendations":
        setNav("recommendations");
        break;
      // case '/albums':
      //   setNav('albums')
      //   break;
      // case '/artists':
      //   setNav('artists')
      //   break;

      case "/playlist":
        setNav("playlist");
        break;
    }
  };

  useEffect(() => {
    setNavGlower();

    if (storedSpotifyToken && !spotifyToken) {
      setAll();
    }
  }, []);

  return (
    <>
      <div id="header">
        {/* eslint-disable-next-line */}
        <h1 id="logo">
          <a href="#">Spotify Recommendations</a>
        </h1>
        <div id="sub-navigation">
          <ul onClick={setNavGlower}>
            <li>
              <Link
                className={nav === "home" ? "active-navigation" : ""}
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={nav === "songs" ? "active-navigation" : ""}
                to="/songs"
              >
                Songs
              </Link>
            </li>
            {/* <li><Link className={nav === 'top' ? 'active-navigation':''} to="/top">Top</Link></li> */}
            <li>
              <Link
                className={nav === "recommendations" ? "active-navigation" : ""}
                to="/recommendations"
                onClick={setUpdatedRecommendations}
              >
                Recommendations
              </Link>
            </li>
            {/* <li><Link className={nav === 'albums' ? 'active-navigation':''} to="/albums">Albums</Link></li> */}
            {/* <li><Link className={nav === 'artists' ? 'active-navigation':''} to="/artists">Artists</Link></li> */}
            <li>
              <Link
                className={nav === "playlist" ? "active-navigation" : ""}
                to="/playlist"
                onClick={setUpdatedPlaylist}
              >
                Playlist
              </Link>
            </li>
          </ul>

          <div className="btn-container">
            {!spotifyToken && (
              <button className="btn" onClick={authorizeSpotify}>
                Authorize
              </button>
            )}
            {/* {(() => {
              if (
                nav === "recommendations" ||
                nav === "albums" ||
                nav === "artists"
              ) {
                return (
                  <button className="btn" onClick={setAll}>
                    Generate New
                  </button>
                );
              }
            })()} */}
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
