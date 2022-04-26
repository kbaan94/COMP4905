import "./mediaControl.css";
import { useState, useEffect } from "react";
import { selectedSong } from "actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";
import React from "react";
const customStyles = {
  content: {
    fontFamily: "inherit",
    fontSize: "16px",
    fontWeight: "bold",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    background: "#000000",
  },
};
Modal.setAppElement("#root");
const MediaControl = (props) => {
  const music = props.data;
  const [auth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [token] = useState(JSON.parse(localStorage.getItem("spotify_token")));
  const [audio, setAudio] = useState(new Audio());
  const dispatch = useDispatch();
  // const currentTrack = useSelector(state => state.currentSongReducer.currentSong)
  const [playing, setPlaying] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [createPlaylist, setCreatePlaylist] = useState("");
  const [userId, setUserId] = useState("");
  const [allPlaylist, setallPlaylist] = useState([]);
  const [added, setAdded] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    axios
      .get(
        process.env.REACT_APP_SERVER_ADDRESS +
          "/api/spotify/" +
          music.id +
          "/" +
          "song",
        {
          headers: {
            Authorization: "Bearer " + auth.accessToken,
          },
        }
      )
      .then((res) => {
        if (res.data[0] !== undefined) {
          setLikeActive(res.data[0].like);
          setDislikeActive(res.data[0].dislike);
        }
      });
  }, []);

  function setDislike() {
    setDislikeActive(!dislikeActive);
  }
  function setLike() {
    setLikeActive(!likeActive);
  }
  const handleLike = async () => {
    if (dislikeActive) {
      setDislike();
    }
    setLike();
    let likedislikebody = {};
    if (dislikeActive) {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: !dislikeActive,
        type: "song",
      };
    } else {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: dislikeActive,
        type: "song",
      };
    }
    axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + "/api/update_like",
      likedislikebody,
      {
        headers: {
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    const res = await axios.get(
      `${process.env.REACT_APP_RECOMMEND_SERVER_ADDRESS}/recommendationAPI?song_id=${music.id}&numOfRec=2`
    );
    const sendRec = await axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + "/api/recommend",
      res.data,
      {
        headers: {
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
  };
  function handleDislike() {
    if (likeActive) {
      setLike();
    }
    setDislike();
    let likedislikebody = {};
    if (likeActive) {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: !dislikeActive,
        type: "song",
      };
    } else {
      likedislikebody = {
        item_id: music.id,
        like: likeActive,
        dislike: !dislikeActive,
        type: "song",
      };
    }
    axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + "/api/update_like",
      likedislikebody,
      {
        headers: {
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
  }

  const fetchPlaylistData = () => {
    fetch("https://api.spotify.com/v1/me", {
      headers: new Headers({
        Authorization: "Bearer " + token.access_token,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setUserId(res.id);
        const request = new Request(
          `	https://api.spotify.com/v1/users/${res.id}/playlists`,
          {
            headers: new Headers({
              Authorization: "Bearer " + token.access_token,
            }),
          }
        );
        fetch(request)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            const fetchPlaylistData = res.items.map((ids) => ids.id);
            const likedislikebody = { playlist_id: fetchPlaylistData };
            axios.post(
              process.env.REACT_APP_SERVER_ADDRESS + "/api/playlist",
              likedislikebody,
              {
                headers: {
                  authorization: "Bearer " + auth.accessToken,
                },
              }
            );
            setallPlaylist(res.items);
          });
      });
  };

  function openModal() {
    setIsOpen(true);
    fetchPlaylistData();
  }

  function closeModal() {
    setIsOpen(false);
    setCreatePlaylist("");
  }

  const createNewPlaylist = () => {
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token.access_token,
      }),
      body: JSON.stringify({
        name: createPlaylist,
        description: "None",
        public: false,
      }),
    };
    fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      requestOptions
    ).then((res) => {
      setCreatePlaylist("");
      fetchPlaylistData();
    });
  };

  const addToPlaylist = async (playlistid) => {
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token.access_token,
      }),
      body: JSON.stringify({
        uris: [music.uri],
        position: 0,
      }),
    };
    fetch(
      `https://api.spotify.com/v1/playlists/${playlistid}/tracks`,
      requestOptions
    ).then((res) => {
      if (res.ok) {
        setAdded(true);
        axios.post(
          process.env.REACT_APP_SERVER_ADDRESS + "/api/update_isInPlaylist",
          {
            item_id: music.id,
            playlist_id: playlistid,
          },
          {
            headers: {
              authorization: "Bearer " + auth.accessToken,
            },
          }
        );
      }
    });
    const res = await axios.get(
      `${process.env.REACT_APP_RECOMMEND_SERVER_ADDRESS}/recommendationAPI?song_id=${music.id}&numOfRec=2`
    );
    const sendRec = await axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + "/api/recommend",
      res.data,
      {
        headers: {
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    closeModal()
  };

  const handlePlay = () => {
    setPlaying(true);
    dispatch(selectedSong(music, music.currentIndex));
    audio.src = music.preview_url;
    audio.play();
    var likedislikebody = { played_songs: music.id };
    axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + "/api/played_songs",
      likedislikebody,
      {
        headers: {
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
  };

  const handlePause = () => {
    setPlaying(false);
    audio.pause();
  };

  const handlePrevious = () => {};

  const handleNext = () => {
    // setPlaying(false)
  };

  return (
    <>
      <div className="music">
        {/* eslint-disable-next-line */}
        <a className="music-container">
          <img
            className={playing ? "playing-border" : ""}
            src={music.album.images[0].url}
            alt=""
          />
          <div className={`controller ${playing ? "playing-controller" : ""}`}>
            <svg
              onClick={handlePrevious}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"
              ></path>
            </svg>
            {playing ? (
              <svg
                onClick={handlePause}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"
                ></path>
              </svg>
            ) : (
              <svg
                onClick={handlePlay}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                ></path>
              </svg>
            )}
            <svg
              onClick={handleNext}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"
              ></path>
            </svg>
          </div>
        </a>
        <span className="positioning margin-down">
          <a onClick={() => handleLike()}>{likeActive ? "Liked" : "Like"}</a>
          <a onClick={() => handleDislike()}>
            {dislikeActive ? "Disliked" : "Dislike"}
          </a>
          <a onClick={openModal}>Add</a>
        </span>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="positioning margin-down">
              <span className="margin-auto">Playlist</span>
              <button className="btn-close" onClick={closeModal}>
                x
              </button>
            </div>
            <hr />
            <div className="margin-up margin-down">
              {allPlaylist &&
                allPlaylist.map((item) => (
                  <div key={item.id} className="positioning">
                    <span className="margin-auto">{item.name}</span>
                    <button
                      className="btn"
                      onClick={() => addToPlaylist(item.id)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              {allPlaylist.length === 0 && (
                <div className="text-center">
                  <p>No Playlist Create One!</p>
                </div>
              )}
            </div>
            <hr />
            <div className="margin-up">
              <input
                className="inputtaker"
                type="text"
                name="name"
                value={createPlaylist}
                onChange={(e) => setCreatePlaylist(e.target.value)}
              />
              <button className="btn" onClick={createNewPlaylist}>
                Create
              </button>
            </div>
          </Modal>
        </div>

        <span className={playing ? "playing" : ""}>
          {music.name} by {music.artists[0].name}
        </span>
      </div>
    </>
  );
};

export default MediaControl;
