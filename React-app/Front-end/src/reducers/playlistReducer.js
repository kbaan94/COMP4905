import { FETCH_PLAYLIST_SUCCESS,FETCH_PLAYLIST_ERROR } from "actions/userActions"
const playlistReducer = (state={},action) => {
    switch(action.type){
        case FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                playlist:action.payload,
                fetchPlaylist: true
            }
        case FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                fetchPlaylist: false
            }
        default:
            return state;
    }
}
export default playlistReducer;