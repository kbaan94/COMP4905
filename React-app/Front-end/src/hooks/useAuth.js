import axios from 'axios'
import { useState } from 'react'
import authHeader from 'services/auth-header';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [authed,setAuthed] = useState(false)
    const API_URL = process.env.REACT_APP_SERVER_ADDRESS+"/auth";
    const navigate = useNavigate()

    
    const register = (email, password,confirm_password) => {

        return new Promise((resolve,reject) => {
          axios.post(API_URL + "/register", {
            email,
            password,
            confirm_password
          }).then((res) => {
              if (res.data.accessToken){
                  localStorage.setItem('auth',JSON.stringify(res.data))
                  localStorage.setItem('isAuth',true)
              }
              setAuthed(true)
              resolve(res)
          });
        })
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
              localStorage.setItem("auth", JSON.stringify(response.data));
            }
            setAuthed(true)
            localStorage.setItem('isAuth',true)
            return response.data;
          });
    };
    const logout = () => {
      axios.post(API_URL+'/logout',{
        refreshToken : JSON.parse(localStorage.getItem('auth')).refreshToken
      },authHeader()).then(() => {
        setAuthed(false)
        localStorage.setItem('isAuth',false)
        localStorage.removeItem("auth");
        localStorage.removeItem('spotify_token')
        navigate("/login")
      }, (err) => {
        console.log(err)
      })
    };
    const getCurrentUser = () => {
      axios.get(process.env.REACT_APP_SERVER_ADDRESS+"/api/show",authHeader()).then((res) => {
        return res.data
      })
    };

    return {
        authed,login,register,logout,getCurrentUser
    }
}
export default useAuth;