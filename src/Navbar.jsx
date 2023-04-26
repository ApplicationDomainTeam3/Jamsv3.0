import React, {useState, useEffect} from "react";
import menuLogo from './img/jamstoast.png'
import {AuthDetails } from './AuthDetails';
import {Link, NavLink} from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { usersCollectionRef } from './firebase';
import { useNavigate } from "react-router-dom";

import "./NavbarStyles.css"


//Main navigation menu
export function Navbar(){
    const [click, setClick] = useState(false)
    const handleClock = () => setClick(!click)
    
    const [authUser, setAuthuser] = useState(null);
    const [role, setRole] = useState("")
    const [userUID, setuserUID] = useState("")
    const [firstName, setFirstName] = useState("")
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    

    useEffect(() => {
        const listen = onAuthStateChanged(auth, async (user) => {
            if(user) {
                setAuthuser(user) //if user us logged in, set authuser to the logged in user
                setuserUID(user.uid)
                
                
                const q = query(usersCollectionRef, where("userUID", "==", user.uid));
               

                const querySnapshot = await getDocs(q);
                if(querySnapshot.empty){
                    console.log("no document")
                }
                querySnapshot.forEach((doc)=>{
                   
                    const data = doc.data();
                    setRole(data.role)
                    setFirstName(data.firstName)
                    
                    console.log("the user's role is: ", role)
                })

            }else{
                setAuthuser(null);//otherwise authuser is null
                
            }
            
        });

        return () => {
            listen();
        }

    }, [authUser, userUID, role]);

    return (
        <nav>
        {authUser ?  <div>
            <ul id="navbar">
                <li className = "nav-logo"> 
                    <img src={menuLogo} alt="logo"/>
                </li>
                <li>Welcome {firstName}!</li>
                <li><Link  to="home"><a>Dashboard</a></Link></li>
                <li><Link to="home/viewaccounts"><a>View Accounts</a></Link></li>
                {role === "admin" &&
                    <li><Link to="home/addaccount"><a>Add Accounts</a></Link></li>
                }
                
                <li><Link to="home/createje">Journal Entry</Link></li>
                <li className="authdetails">< AuthDetails/></li>  {/*sign in info displayed in */}
            </ul>
        </div>: <></>}
        
    </nav>
    );
}

