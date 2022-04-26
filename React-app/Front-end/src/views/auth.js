import './auth.css'
import { useInput,useAuth } from 'all';
import { isEmail } from "validator";
import { Link } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
// import {login,register} from 'services/auth.service'
import { useEffect,useRef, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

// eslint-disable-next-line 
export default (props) => {
    const nextLink = (props.type === 'register')? '/login':'/register'
    const title = props.type.charAt(0).toUpperCase() + props.type.slice(1)
    const navigate = useNavigate()
    const location = useLocation()
    const {login,register} = useAuth()

    const form = useRef()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()
    const [successful,setSuccessful] = useState(false)

    const {value:email, bind:emailBind, reset: resetEmail} = useInput("")
    const {value:password, bind:passwordBind, reset: resetPassword} = useInput("")
    const {value:confirm_password, bind:confirmPasswordBind, reset: resetConfirmPassword} = useInput("")

    // VALidations
    const required = (value) => {
        if (!value) {
          return (
            <span className="alert">
              This field is required!
            </span>
          );
        }
    };
      
    const vemail = (value) => {
        if (!isEmail(value)) {
            return (
                <span className="alert">
                    This is not a valid email.
                </span>
            );
        }
    };
    
    
    const vpassword = (value) => {
        if (value.length < 6 || value.length > 40) {
            return (
                <span className="alert">
                    The password must be between 6 and 40 characters.
                </span>
            );
        }
    };

    const vconfirmpassword = (value) => {
        if (value !== document.getElementById('password').value){
            return (
                <span className='alert'>
                    The Confirmation Password is not same.
                </span>
            )
        }
    }

    const resetAll = () => {
        resetEmail()
        resetPassword()
        resetConfirmPassword()
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        setMessage("")
        setLoading(true)

        form.current.validateAll();

        if (props.type === 'register'){
            register(email,password,confirm_password).then((res) => {
                setMessage(res.data.message)
                setSuccessful(true)
                navigate("/")
                resetAll()
            }, (error) => {
                const resMessage =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            })

        }
        else if (props.type === 'login'){
            login(email,password).then((res) => {
                navigate("/")
                resetAll()
            },(error) => {
                const resMessage =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            })
        }else{
            setLoading(false)
        }

    }

    useEffect(() => {
        resetAll();
    },[location]);

    return (
        <>
            <div className="wrapper">
                <div className="container">
                    <h1>{title}</h1>
                    {!successful && (
                        <Form className="form" onSubmit={handleSubmit} ref={form}>
                            <Input type="email" placeholder="Email" {...emailBind} validations={[required,vemail]}/>
                            <Input id="password" type="password" placeholder="Password" {...passwordBind} validations={[required,vpassword]}/>
                            {props.type === 'register' && <Input type="password" placeholder="Confirm Password" {...confirmPasswordBind} validations={[required,vconfirmpassword]}/>}
                        
                            <button type="submit" id="login-button">{title}</button>
                        </Form>
                    )}

                    {message && (
                        <div className="form-group">
                        <div
                          className={ successful ? "alert alert-success" : "alert alert-danger" }
                          role="alert"
                        >
                          {message}
                        </div>
                      </div>
                    )}

                    <p className="message">{props.type==='register' ? 'Already':'Not'} registered? <Link to={nextLink}>{props.type === 'register'? 'Login':'Create an account'}</Link></p>
                </div>
                
            </div>

        </>
    );
}