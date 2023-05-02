import { getAuth, onAuthStateChanged } from "firebase/auth";

import React, { useEffect, useState } from 'react';
import { query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { usersCollectionRef } from './firebase';
import { AdminHome } from './AdminHome';
import { ManagerHome } from './ManagerHome'
import {AccountantHome} from './AccountantHome'
import { useNavigate } from "react-router-dom";
import menuLogo from './img/JAMS_1563X1563.png'
import Table from 'react-bootstrap/Table';
import { IncomeData } from "./IncomeData";
import {BSData} from "./BSData"
import {db} from './firestore';
import { collection, deleteDoc, doc} from "firebase/firestore"
import { DashMessages } from "./DashMessages";




export const Home= () => {

    const [authUser, setAuthuser] = useState(null);
    const [role, setRole] = useState("")
    const [userUID, setuserUID] = useState("")
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
                    console.log(doc.id, " => ", doc.data());
                    const data = doc.data();
                    setRole(data.role)
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

    ////////Notifications/////////////
    const notificationsCollectionRef = collection(db, "mnotifications")
    const [notifications, setNotifications] = useState([])
    const [notifCount, setNotifCount] = useState(0)

    const removeNotification = async(id) => {
        const notificationDoc = doc(db, "mnotifications", id)
        await deleteDoc(notificationDoc);        
    }

    useEffect(() => {

        const getNotifications = async () => {
            const data = await getDocs(notificationsCollectionRef);
            
            setNotifications(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
            
           
        };

        getNotifications();
    }, []);

    return (
        <>
        <div className = "big-logo">
            <img src={menuLogo} alt="logo"/>

        </div>
       <div className="home-container">
       {role === "admin" &&
            <AdminHome />
        }
         {role === "manager" &&
            <ManagerHome />
        }
         {role === "accountant" &&
            <AccountantHome />
        }
       </div>
       <div className="column-container-invis">
            <div className="financial-ratios-container">
            <h2>Financial Ratio Analysis</h2>
            <IncomeData/>
            <BSData/>
            </div>
            <div className="financial-ratios-container">
            <h2>Messages</h2>
            <DashMessages/>
            </div>
        </div>
        </>
        
         
        
        );
}

