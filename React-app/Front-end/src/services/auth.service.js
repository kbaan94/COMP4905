import axios from "axios";

const API_URL = process.env.REACT_APP_SERVER_ADDRESS+"/auth";


const register = (email, password,confirm_password) => {
  return axios.post(API_URL + "/register", {
    email,
    password,
    confirm_password
  });
};

const login = (email, password,confirm_password) => {
  return axios
    .post(API_URL + "/login", {
      email,
      password,
      confirm_password
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export {
  register,
  login,
  logout,
  getCurrentUser,
};