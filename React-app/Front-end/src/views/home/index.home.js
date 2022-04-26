import './index.home.css'
import {Header,Footer,MediaControl,Playlist,useSpotifySetter} from 'all'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line
export default () => {
    const {setAll} = useSpotifySetter()

    const recommendedSongs = useSelector(state => state.recommendationsReducer.recommendations)
    const popularTracks = useSelector(state => state.popularReducer.popular)
    const playlistItems = useSelector((state) => state.playlistReducer.playlist);
    const [playist_Data,usePlayist_Data] = useState([])
    const [recommend_songs, useRecommendedSongs] = useState([])
    const [popular_songs,usePopularSongs] = useState([])
    useEffect(() => {
        if (playlistItems == undefined | popularTracks == undefined){
        // if (playlistItems == undefined | recommendedSongs == undefined | popularTracks == undefined){
            setAll()
        }else{
            usePlayist_Data(playlistItems.slice(0,(playlistItems.length > 10)? 10:playlistItems.length+1))
            useRecommendedSongs(recommendedSongs === undefined ? [] : recommendedSongs.slice(0,(recommendedSongs.length > 10)? 10:recommendedSongs.length+1))
            usePopularSongs(popularTracks.slice(0,(popularTracks.length > 11)? 10:popularTracks.length+1))
        }
    },[playlistItems,recommendedSongs,popularTracks])
  
    return (
        <>
            <Header/>
            <div id='main'>
                <div id="content">
                    <div className="head">
                        <h2>Songs</h2>
                        <p className="text-right"><Link to="/songs">See all</Link></p>
                    </div>
                    <div className="box">
                        {
                            popular_songs.map((music) => 
                                <MediaControl key={music.name+"songs"} data={music}/>
                            )
                        }
                        <div className="cl">&nbsp;</div>
                    </div>

                    <div className="head">
                        <h2>Recommended Songs</h2>
                        <p className="text-right"><Link to="/recommendations">See all</Link></p>
                    </div>
                    <div className="box">
                        {
                            recommend_songs.map((music) => 
                                <MediaControl key={music.name+"recommendations"} data={music}/>
                            )
                        }
                        <div className="cl">&nbsp;</div>
                    </div>

                    <div className="head">
                        <h2>playlist</h2>
                        <p className="text-right"><Link to="/playlist">See all</Link></p>
                    </div>

                    <div className="box">
                        {
                            playist_Data.map((music) => 
                                <Playlist key={music.name+"playlist"} data={music}/>
                            )
                        }
                        <div className="cl">&nbsp;</div>
                    </div>
                    
                </div>  
                <div className="cl">&nbsp;</div>
            </div>
            <Footer/>
        </>
    )
}