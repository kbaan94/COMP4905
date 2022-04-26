import './mediaControl.css'
import { useState, useEffect } from 'react'
import { selectedSong } from 'actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'


const MediaControl = (props) => {
    const music = props.data
    const [audio,setAudio] = useState(new Audio())
    const [like,setLike] = useState([])

    const dispatch = useDispatch()
    // const currentTrack = useSelector(state => state.currentSongReducer.currentSong)
    const [playing,setPlaying] = useState(false)

    const handlePlay = () => {
        setPlaying(true)
        dispatch(selectedSong(music,music.currentIndex))
        audio.src = music.preview_url
        audio.play()
    }

    const handlePause = () => {
        setPlaying(false)
        audio.pause()
    }

    const handlePrevious = () => {
        
    }

    const handleNext = () => {
        // setPlaying(false)
    }

    useEffect(() => {
        if (like !== true){
            setLike(false)
        }
        // axios.get(process.env.REACT_APP_SERVER_ADDRESS+"/api/"+music.id+"/"+'song').then((res) => {
        //     setLike(res.data.like)
        // })
    })

    const handleLike = () => {
        setLike(!like)
        var token = JSON.parse(localStorage.getItem('auth'))
        // console.log(token.accessToken, music.id)
        axios.post(process.env.REACT_APP_SERVER_ADDRESS+"/api/update_like",{
            item_id: music.id,
            like: like,
            type: 'album'
        },{
            headers: {
                'authorization': 'Bearer '+token.accessToken
            }
        })
    }

    return (
        <>
            <div className="music" >
                {/* eslint-disable-next-line */ }
                <a className='music-container'>
                    <img className={playing ?'playing-border':''} src={music.album.images[0].url} alt="" />
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
                <span className={playing ? 'playing':''}>{music.album.name} by {music.artists[0].name}</span>
                {/* music.album.id */}
            </div>
        </>
    )
}

export default MediaControl;