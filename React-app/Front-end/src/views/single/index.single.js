import "./index.single.css";
import { Header, Footer, MediaControl, Playlist } from "components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSpotify, useSpotifySetter } from "all";
import axios from "axios";

const Single = (props) => {
  const type = props.type;
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const [musicList, setMusicList] = useState([]);
  const [isPlaylist, setIsPlaylist] = useState([]);
  // const topTracks = useSelector((state) => state.topTracksReducer.topTracks);
  const recommendedSongs = useSelector(
    (state) => state.recommendationsReducer.recommendations
  );
  const popularTracks = useSelector((state) => state.popularReducer.popular);
  const playlistItems = useSelector((state) => state.playlistReducer.playlist);
  const auth = useSelector((state) => state.tokenReducer.token);
  const { spotifyApi } = useSpotify();
  const [reloadCount, setReloadCount] = useState(0);
  const { setAll } = useSpotifySetter();

  useEffect(() => {
    setReloadCount(reloadCount + 1);
    setIsPlaylist(false);
    switch (type) {
      case "songs":
        setMusicList(popularTracks);
        break;
      case "recommendations":
        setMusicList(recommendedSongs === undefined ? [] : recommendedSongs);
        break;
      case "playlist":
        setMusicList(playlistItems);
        setIsPlaylist(true); 
        break;
    }
    if (musicList && musicList.length < 1 && reloadCount < 15) {
      setAll();
    }
  }, [popularTracks, recommendedSongs, props.type, playlistItems]);

  // useEffect(() => {
  //     setMusicList(recommendedSongs)
  // },[recommendedSongs])
  const handleTest = () => {
    if (auth) {
      // console.log(spotifyApi.getCategoryPlaylists('toplists'))
      spotifyApi.getCategoryPlaylists("toplists", function (err, data) {
        if (err) console.error(err);
        else {
          // console.log('Artist albums', data.playlists );
          console.log("Artist albums", data.playlists.items[0].id);
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
              console.log("hello", res.data.items);
            });
          // console.log('Artist albums', data.playlists.items[0].tracks );
        }
      });
      // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
      //     if (err) console.error(err);
      //     else console.log('Artist albums', data);
      // });
    }
  };

  return (
    <>
      <Header />
      <div className="main">
        <div id="content">
          <div className="head">
            <h2>{title}</h2>
          </div>
          <div className="box">
            {(() => {
              /* if (musicList && isAlbum) {
                return musicList.map((music) => (
                  <Album data={music} key={music.id + 'songs'} />
                ));
              } else if (musicList && isArtist) {
                return musicList.map((music) => (
                  <Artist data={music} key={music.id + 'songs'} />
                ));
              }  */

              if (musicList && isPlaylist) {
                return musicList.map((playlist) => (
                  <Playlist data={playlist} key={playlist.id + "playlist"} />
                ));
              } else if (musicList) {
                return musicList.map((music) => (
                  <MediaControl data={music} key={music.id + "songs"} />
                ));
              }
            })()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Single;
