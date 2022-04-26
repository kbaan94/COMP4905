export const SET_TOKEN="SET_TOKEN"

//to store token
export const setToken = (token) => {

    return {
      type: SET_TOKEN,
      payload:token
    };
    
};