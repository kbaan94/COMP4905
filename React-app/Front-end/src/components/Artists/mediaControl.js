import './mediaControl.css'
import { useState ,useEffect} from 'react'
import { selectedSong } from 'actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'


const MediaControl = (props) => {
    const music = props.data
    const [audio,setAudio] = useState(new Audio())
    const dispatch = useDispatch()
    const [like,setLike] = useState([])

    // const currentTrack = useSelector(state => state.currentSongReducer.currentSong)
    const [playing,setPlaying] = useState(false)

    const handlePlay = () => {
        setPlaying(true)
        dispatch(selectedSong(music,music.currentIndex))
        audio.src = music.preview_url
        audio.play()
    }

    useEffect(() => {
        if (like !== true){
            setLike(false)
        }
        // axios.get(process.env.REACT_APP_SERVER_ADDRESS+"/api/"+music.id+"/"+'song').then((res) => {
        //     setLike(res.data.like)
        // })
    })

    const handlePause = () => {
        setPlaying(false)
        audio.pause()
    }

    const handlePrevious = () => {
        
    }
    const handleLike = () => {
        setLike(!like)
        var token = JSON.parse(localStorage.getItem('auth'))
        // console.log(token.accessToken, music.id)
        axios.post(process.env.REACT_APP_SERVER_ADDRESS+"/api/update_like",{
            item_id: music.id,
            like: like,
            type: 'artist'
        },{
            headers: {
                'authorization': 'Bearer '+token.accessToken
            }
        })
    }

    const handleNext = () => {
        // setPlaying(false)
    }

    return (
        <>
            <div className="music" >
                {/* eslint-disable-next-line */ }
                <a className='music-container'>
                    <img className={playing ?'playing-border':''} src={music.album.images[0].url} alt="" />
                    {/* <div className={`controller ${playing? 'playing-controller':''}`}>
                        <svg onClick={handlePrevious} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"></path></svg>
                        {playing ?
                            <svg onClick={handlePause} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg>
                            :
                            <svg onClick={handlePlay} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                        }
                        <svg onClick={handleNext} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"></path></svg>
                    </div> */}
                </a>
                <span><a onClick={handleLike}>{
                    (() => {
                        if (like){
                            return 'Liked'
                        }
                        else{
                            return 'Like'
                        }
                    })()
                }</a></span>
                <span className={playing ? 'playing':''}>{music.artists[0].name}</span>

            </div>
        </>
    )
}

export default MediaControl;