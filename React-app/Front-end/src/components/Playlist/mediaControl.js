import "./mediaControl.css";
import { useState, useEffect } from "react";
import { selectedSong } from "actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const MediaControl = (props) => {
  const music = props.data;
  // const dispatch = useDispatch();
  const [auth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  useEffect(() => {
    var auth = JSON.parse(localStorage.getItem("auth"));
    axios
      .get(
        process.env.REACT_APP_SERVER_ADDRESS +
          "/api/spotify/" +
          music.id +
          "/" +
          "playlist",
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
  function handleLike() {
    if (dislikeActive) {
      setDislike();
    }
    setLike();
    var likedislikebody = {};
    if (dislikeActive) {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: !dislikeActive,
        type: "playlist",
      };
    } else {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: dislikeActive,
        type: "playlist",
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
  function handleDislike() {
    if (likeActive) {
      setLike();
    }
    setDislike();
    var likedislikebody = {};
    if (likeActive) {
      likedislikebody = {
        item_id: music.id,
        like: !likeActive,
        dislike: !dislikeActive,
        type: "playlist",
      };
    } else {
      likedislikebody = {
        item_id: music.id,
        like: likeActive,
        dislike: !dislikeActive,
        type: "playlist",
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

  return (
    <>
      <div className="music">
        <a className="music-container">
          {music.images[0] ? <img src={music.images[0].url} alt="" /> : <div className="no-picture">No Picture Found</div>}
        </a>
        <span className="positioning">
          <a onClick={() => handleLike()}>{likeActive ? "Liked" : "Like"}</a>
          <a onClick={() => handleDislike()}>
            {dislikeActive ? "Disliked" : "Dislike"}
          </a>
        </span>
        <span>{music.name}</span>
      </div>
    </>
  );
};

export default MediaControl;
