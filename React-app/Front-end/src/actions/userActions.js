import axios from "axios";
import { setToken } from "./tokenActions";
import SpotifyWebApi from "spotify-web-api-js";

export const CURRENT_SONG = "CURRENT_SONG";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
// export const FETCH_TOP_TRACK_ERROR = "FETCH_TOP_TRACK_ERROR";
// export const FETCH_TOP_TRACK_SUCCESS = "FETCH_TOP_TRACK_SUCCESS";
export const FETCH_RECOMMENDATIONS_ERROR = "FETCH_RECOMMENDATIONS_ERROR";
export const FETCH_RECOMMENDATIONS_SUCCESS = "FETCH_RECOMMENDATIONS_SUCCESS";
export const FETCH_POPULAR_SUCCESS = "FETCH_POPULAR_SUCCESS";
export const FETCH_POPULAR_ERROR = "FETCH_POPULAR_ERROR";
export const FETCH_PLAYLIST_SUCCESS = "FETCH_PLAYLIST_SUCCESS";
export const FETCH_PLAYLIST_ERROR = "FETCH_PLAYLIST_ERROR";

//to check if user is successfully fetched
export const fetchUserSuccess = (user) => {
  return { type: "FETCH_USER_SUCCESS", user };
};

export const fetchUserError = () => {
  return { type: "FETCH_USER_ERROR" };
};

export const fetchPopularSuccess = (tracks) => {
  return { type: "FETCH_POPULAR_SUCCESS", payload: tracks };
};
export const fetchPopularError = () => {
  return { type: "FETCH_POPULAR_ERROR" };
};
export const fetchPlaylistSuccess = (res, authToken) => {
  const fetchPlaylistData = res.map((ids) => ids.id);
  const likedislikebody = { playlist_id: fetchPlaylistData };
  axios.post(
    process.env.REACT_APP_SERVER_ADDRESS + "/api/playlist",
    likedislikebody,
    {
      headers: {
        authorization: "Bearer " + authToken.accessToken,
      },
    }
  );
  return { type: "FETCH_PLAYLIST_SUCCESS", payload: res };
};
export const fetchPlaylistError = () => {
  return { type: "FETCH_PLAYLIST_ERROR" };
};

//to check if top tracks is successfully fetched
// export const fetchTopTrackSuccess = (res) => {
//   return { type: "FETCH_TOP_TRACK_SUCCESS", payload: res.items };
// };

// export const fetchTopTrackError = () => {
//   return { type: "FETCH_TOP_TRACK_ERROR" };
// };

//to fetch is recommendations is successfully fetched
export const fetchRecommendationsSuccess = (res) => {
  return { type: "FETCH_RECOMMENDATIONS_SUCCESS", payload: res.tracks };
};

export const fetchRecommendationsError = (res) => {
  return { type: "FETCH_RECOMMENDATIONS_ERROR" };
};

//to store current played song
export const selectedSong = (song, index) => ({
  type: CURRENT_SONG,
  payload: { index, song },
});

const refreshToken = (refresh_token) => {
  let headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      password: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
    },
  };
  axios
    .post(
      "https://accounts.spotify.com/api/token",
      `grant_type=refresh_token&refresh_token=${refresh_token}`,
      headers
    )
    .then((resp) => {
      const rr = resp.data;
      const previous_data = JSON.parse(localStorage.getItem("spotify_token"));
      previous_data.access_token = rr.access_token;
      localStorage.setItem("spotify_token", JSON.stringify(previous_data));
      setToken(previous_data);
    });
};

//action to fetch user details
export const fetchUser = (auth) => {
  return (dispatch) => {
    if (auth) {
      const request = new Request("https://api.spotify.com/v1/me", {
        headers: new Headers({
          Authorization: "Bearer " + auth.access_token,
        }),
      });

      fetch(request)
        .then((res) => {
          // send user back to homepage if no token
          if (res.status === 401) {
            // window.location.href = './';
            refreshToken(auth.refresh_token);
          }
          return res.json();
        })
        .then((res) => {
          dispatch(fetchUserSuccess(res));
        })
        .catch((err) => {
          dispatch(fetchUserError(err));
        });
    }
  };
};

//action to fetch top tracks
// export const fetchTopTracks = (auth) => {
//   return (dispatch) => {
//     if (auth) {
//       const request = new Request("https://api.spotify.com/v1/me/top/tracks", {
//         headers: new Headers({
//           Authorization: "Bearer " + auth.access_token,
//         }),
//       });

//       fetch(request)
//         .then((res) => {
//           // send user back to homepage if no token
//           if (res.status === 401) {
//             // window.location.href = './';
//             refreshToken(auth.refresh_token);
//           }
//           return res.json();
//         })
//         .then((res) => {
//           dispatch(fetchTopTrackSuccess(res));
//         })
//         .catch((err) => {
//           dispatch(fetchTopTrackError(err));
//         });
//     }
//   };
// };

//to fetch recommendations
export const fetchRecommendations = (
  auth,
  authToken
  // seed_artists = "4NHQUGzhtTLFvgF5SZesLK",
  // seed_tracks = "0c6xIDDpzE81m2q797ordA"
) => {
  return (dispatch) => {
    if (auth) {
      const getRecommendationReq = new Request(
        process.env.REACT_APP_SERVER_ADDRESS + "/api/recommend",
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.accessToken,
          }),
        }
      );
      fetch(getRecommendationReq)
        .then((response) => {
          return response.json();
        })
        .then((getData) => {
          if (getData[0].recommend_id !== undefined) {
            const ids = getData[0].recommend_id;
            if (ids.length > 0) {
              const idString = ids.join(",");
              const request = new Request(
                `https://api.spotify.com/v1/tracks?market=IN&ids=${idString}`,
                {
                  headers: new Headers({
                    Authorization: "Bearer " + auth.access_token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  }),
                }
              );
              fetch(request)
                .then((res) => {
                  // send user back to homepage if no token
                  if (res.status === 401) {
                    // window.location.href = './';
                    refreshToken(auth.refresh_token);
                  }
                  return res.json();
                })
                .then((res) => {
                  dispatch(fetchRecommendationsSuccess(res));
                })
                .catch((err) => {
                  dispatch(fetchRecommendationsError(err));
                });
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };
};

export const fetchPopularSongs = (auth) => {
  return (dispatch) => {
    if (auth) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(auth.access_token);
      spotifyApi.getCategoryPlaylists("toplists", function (err, data) {
        if (err) console.error(err);
        else {
          // console.log('Artist albums', data.playlists );
          // console.log('Artist albums', data.playlists.items[0].id );
          axios
            .get(
              `https://api.spotify.com/v1/playlists/${data.playlists.items[0].id}/tracks`,
              {
                headers: {
                  Authorization: "Bearer " + auth.access_token,
                },
              }
            )
            .then((res) => {
              // console.log('hello',res.data.items)
              const arr = [];
              for (let track of res.data.items) {
                arr.push(track.track);
              }
              dispatch(fetchPopularSuccess(arr));
            })
            .catch((err) => {
              dispatch(fetchPopularError);
            });
          // console.log('Artist albums', data.playlists.items[0].tracks );
        }
      });
    }
  };
};
export const fetchPlaylist = (auth, authToken) => {
  return (dispatch) => {
    if (auth) {
      axios
        .get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        })
        .then((res) => {
          dispatch(fetchPlaylistSuccess(res.data.items, authToken));
        })
        .catch((err) => {
          dispatch(fetchPlaylistError);
        });
    }
  };
};
