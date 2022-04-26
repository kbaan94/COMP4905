import {SET_TOKEN} from 'actions/tokenActions'

//reducer to store token
const tokenReducer = (state = {}, action) => {
  switch (action.type) {

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };

    default:
      return state;
  }
};

export default tokenReducer