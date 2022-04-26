import {FETCH_USER_SUCCESS} from 'actions/userActions'
import {FETCH_USER_ERROR} from 'actions/userActions'

//reducer to store user details
const userReducer = (state = {}, action) => {

  switch (action.type) {

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
        fetchUserError: false
      };

    case FETCH_USER_ERROR:
      return {
        ...state,
        fetchUserError: true
      };

    default:
      return state;
  }

};

export default userReducer;