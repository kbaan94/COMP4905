import axios from 'axios'
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "actions/tokenActions";
import { fetchUser,fetchTopTracks,fetchRecommendations, fetchPopularSongs, fetchPlaylist } from "actions/userActions";

const SpotifyCallback = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        let text = window.location.href
        let code = text.match(/code=(.+)/)
        if (code && code.length > 1){
            code = code[1]
            console.log(code)

            const headers = {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                  username: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
                  password: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
                },
            };

            
            axios.post(
                    'https://accounts.spotify.com/api/token',
                    `grant_type=authorization_code&code=${code}&redirect_uri=${window.location.origin}/callback`,
                    headers
            ).then((resp) => {
                localStorage.setItem('spotify_token',JSON.stringify(resp.data));
                let authToken = JSON.parse(localStorage.getItem("auth"));
                dispatch(setToken(resp.data))
                dispatch(fetchUser(resp.data))
                // dispatch(fetchTopTracks(resp.data))
                dispatch(fetchRecommendations(resp.data,authToken))
                dispatch(fetchPopularSongs(resp.data))
                dispatch(fetchPlaylist(resp.data,authToken))
            }).catch((err) => {
                console.log(err.response)
            })
        }

        navigate("/")
    },[])



    return (
        <>
        </>
    )
}
export default SpotifyCallback