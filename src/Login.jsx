import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import React, {useState} from "react";
import {Forgotpass} from './Forgotpass';
import {Link} from "react-router-dom"





export const Login = (props) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    {/*start app on login screen */}
  const [currentForm, setCurrentForm] = useState('login');
  const toggleForm = (formName) =>{
    setCurrentForm(formName);
  }
    {/* event handler for form entry*/}
    
    const logIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
        }).catch((error) => {
            console.log(error);
        })

    }
    //login form
    return(
        
        
        <div className="auth-form-container">
            <form className="login-form" onSubmit={logIn}>
                <h2>Login</h2>
                <label htmlFor="email">Username</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="username (your email)" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) =>setPassword(e.target.value) } type="password" placeholder="******" id="password" name="password"/>
                <button type="submit">Log In</button>
            </form>
            {/* switch to password form*/}
            <Link to="/forgotpass">
            <button className="link-btn" >Forgot password</button>
            </Link>
            <Link to="/register">
                <button className="link-btn" >Register New Account</button>
            </Link>
            
            
        </div>
        
    );
}

