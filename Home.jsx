import React from 'react'; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCreate } from 'react-icons/io';
import { Link } from "react-router-dom";
import { ImPlus } from 'react-icons/im';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export const Home = (props) => {
   {/*start app on login screen */}
const [currentForm, setCurrentForm] = useState("Home");
const toggleForm = (formName) =>{
  setCurrentForm(formName); 
}
   
    return (


       
         <>
         <Link to = "/">
            <div className = "card2">
                <AccountCircleIcon sx={{fontSize: 100}}/>
                <h3>Adminstrator</h3>
            </div>
         </Link>
         <Link to = "/">
            <div className = "card2">
                <AccountCircleIcon sx={{fontSize: 100}}/>
                <h3>Manager</h3>
            </div>
         </Link>
         <Link to = "/">
            <div className = "card2">
                <AccountCircleIcon sx={{fontSize: 100}}/>

                <h3>Accountant</h3>
            </div>
         </Link>

        </>
    );
 
}



