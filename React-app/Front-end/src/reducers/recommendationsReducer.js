import { FETCH_RECOMMENDATIONS_ERROR,FETCH_RECOMMENDATIONS_SUCCESS} from 'actions/userActions'

//reducer to fetch recommendations
const recommendationsReducer = (state = {}, action) => {

    switch (action.type) {

      case FETCH_RECOMMENDATIONS_SUCCESS:
      return{
          ...state, 
          recommendations:action.payload,
          fetchRecommendations:true
      }

      case FETCH_RECOMMENDATIONS_ERROR:
      return{
          ...state,
          fetchRecommendations:false
      }
  
    default:
      return state;
    }
  
};
export default recommendationsReducer