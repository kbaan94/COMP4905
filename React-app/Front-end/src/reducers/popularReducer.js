import { FETCH_POPULAR_SUCCESS,FETCH_POPULAR_ERROR } from "actions/userActions"
const popularReducer = (state={},action) => {
    switch(action.type){
        case FETCH_POPULAR_SUCCESS:
            return {
                ...state,
                popular:action.payload,
                fetchPopular: true
            }
        case FETCH_POPULAR_ERROR:
            return {
                ...state,
                fetchPopular: false
            }
        default:
            return state;
    }
}
export default popularReducer;