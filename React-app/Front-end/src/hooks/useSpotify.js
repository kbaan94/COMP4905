import { useState } from 'react';
import { useSelector } from 'react-redux';
import SpotifyWebApi from 'spotify-web-api-js';


const useSpotify = () => {
    const auth = useSelector(state => state.tokenReducer.token)
    const [spotifyApi] = useState(new SpotifyWebApi())
    if (auth){
        spotifyApi.setAccessToken(auth.access_token)
    }
    return {spotifyApi}
}

export default useSpotify