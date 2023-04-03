import { defaultMaxListeners } from "events";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import { auth, app } from "./firebase";
import MustContainElement from "./MustContainElement";
import { Link } from "react-router-dom";
import menuLogo from './img/JAMS_1563X1563.png'
import {  } from 'firebase/auth'; 
import { db } from "./firestore";
import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';





 {/* Administrator screen for registering user*/}
export const Register = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [username, setUsername] = useState('');

    //password validation 
    const [containsUL, setContainsUL ] = useState(false)
    const [containsLL, setContainsLL ] = useState(false)
    const [containsN, setContainsN ] = useState(false)
    const [containsSC, setContainsSC ] = useState(false)
    const [contains8C, setContains8C ] = useState(false)

    //Ensure all validations are true
    const [allValid, setAllValid] = useState(false)

    //Label and state boolean value for each validation
    const MustContainData = [
        ["An uppercase letter (a-z)", containsUL],
        ["A lowercase letter (A-Z)", containsLL],
        ["A number (0-9)", containsN],
        ["A special character (!@#$)", containsSC],
        ["At least 8 characters", contains8C]
        
    ]
    const usersCollectionRef = collection(db, 'users');
    let allUsers = getDocs(usersCollectionRef);
    {/* event handler for registration form*/}
    const registerFBUser = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)

          .then((userCredential) => {
            addDoc(usersCollectionRef, {
                userUID : userCredential.user.uid,
                firstName: firstname,
                lastName: lastname,
                birthday: dob,
                email: email,
                prevPass: [],
                pwExpired: false,
                role: role,
                activated: false,
                suspended : false,
                suspensionStart: '',
                suspensionEnd: '',
                username: '',
                password : password,

            });
            
            console.log(userCredential);
          })
          .catch((error) => {
            console.log(error);
          });
      };


    const validatePassword = () => {
        // has uppercase letter
        if (password.toLowerCase() !== password) setContainsUL(true)
        else setContainsUL(false)
        // has lowercase letter
        if (password.toUpperCase() !== password) setContainsLL(true)
        else setContainsLL(false)
        // has number
        if (/\d/.test(password)) setContainsN(true)
        else setContainsN(false)
        // has special character
        if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password)) setContainsSC(true)
        else setContainsSC(false)
        // has 8 characters
        if (password.length >= 8) setContains8C(true)
        else setContains8C(false)
        // all validations passed
        if (containsUL && containsLL && containsN && containsSC && contains8C ) setAllValid(true)
        else setAllValid(false)
    } 
    
    //registration form
    return(
    
        <><div className="big-logo">
            <img src={menuLogo} alt="logo" />
        </div>
        
        <div className="auth-form-container">
                <Link to="/">
                    <button className="link-btn">Login</button>
                </Link>
                <form className="register-form" onSubmit={registerFBUser}>
                    <h2>Register</h2>
                    <label htmlFor="firstname">First Name</label>
                    <input value={firstname} onChange={(e) => setFirstname(e.target.value)} name="firstname" id="firstname" placeholder="Enter your first name..." />

                    <label htmlFor="lastname">Last Name</label>
                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} name="lastname" id="lastname" placeholder="Enter your last name..." />

                    <label htmlFor="email">Email Adress</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your Email Adress" id="email" name="email" />

                    <label htmlFor="address">Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} type="address" placeholder="Enter your Address" id="address" name="address" />

                    <label htmlFor="dob">Date of Birth</label>
                    <input value={dob} onChange={(e) => setDob(e.target.value)} type="dob" placeholder="mm/dd/yy" id="dob" name="dob" />
                    
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*******" id="password" name="password" onKeyUp={validatePassword} />
                    
                    <button type="submit" id = "submitReg" >Register New User</button>
                    

                </form>
                <div className="must-container cfb">

                    {MustContainData.map(data => <MustContainElement data={data} />)}
                </div>

                
            </div></>

    );
}

export default Register;