import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { IoIosCreate } from 'react-icons/io';
import {Link, createSearchParams, useNavigate} from "react-router-dom"
import { ImWarning } from 'react-icons/im';
import { AiFillProfile } from 'react-icons/ai';
import { usersCollectionRef } from './firebase';
import { query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Alert } from "./Alert";
import { variants } from "./variants";

import Table from 'react-bootstrap/Table';
import menuLogo from './img/JAMS_1563X1563.png'






export const TrialBalance = () =>{

    const [accounts, setAccounts] = useState([]);
    const accountsCollectionRef = collection(db,  "accounts");
    const [authUser, setAuthuser] = useState(null);
    const [role, setRole] = useState("")
    const [userUID, setuserUID] = useState("")
    const [debits, setDebits] = useState("")
    const [credits, setCredits] = useState("")
    const [trialBalance, setTrialBalance] = useState(0)
    const auth = getAuth();   
    const [alert, setAlert] = useState(variants.at(0))
    const [showAlert, setShowAlert] = useState(false) 
    
//////////////////Get user data///////////////////////////////////
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



    

   
    useEffect(() => {

        const getAccounts = async () => {
            const data = await getDocs(accountsCollectionRef);
            setAccounts(data.docs.map((doc) => ({...doc.data(), id: doc.id })));

        };

        getAccounts();
    }, []);

   
    useEffect(() => {

     
        const getTrialBalance =  async () => {
     
            let debitSum = 0;
            let creditSum = 0;
           

    
            const querySnapshot = await getDocs(collection(db, "accounts"));
            
                    querySnapshot.forEach((doc) => {
                  
                    var data = doc.data();
                   if(data.category === "asset")
                   { 
                    debitSum += parseFloat(data.balance)
                    }
                    if(data.category === "liability" ||data.category === "equity"||data.category === "expense")
                   { 
                    creditSum += parseFloat(data.balance)
                  
                    }

                    
                    });
                
            // the sum of the credits is subtracted from the sum of the credits and set as the new balance
            setDebits(debitSum);
            setCredits(creditSum);
         
            const newBalance = parseFloat(debitSum)-parseFloat(creditSum);
            setTrialBalance(newBalance)
            if(newBalance !== 0)
            {
                setAlert(variants.at(10));
                setShowAlert(true)
            }
           
        }

        getTrialBalance();
        
    }, []); 


    //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
    function numberWithCommas(x) {

        
        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   

    return(
       
        
        <>
      
        <div > 
                    <>
                   
                    <div className="trial-balance-container">
                    <h1>Trial Balance</h1>
                    
                    <Table responsive striped bordered hover>

                        <thead>
                            <tr>
                            <th>Accounts</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            </tr>
                        </thead>
                       
                        <tbody >
                            {accounts && accounts.map((account) => (
                            <tr key={account.id}>
                            <td>{account.name}</td>
                            {account.category === "asset" &&
                            <>
                                 <td>${numberWithCommas(account.balance)}</td>
                                 <td></td>
                            </>
                            }
                            {account.category === "liability"  &&
                            <>
                                <td></td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>
                            
                            || account.category === "expense"  &&
                            <>
                                <td></td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>|| account.category === "equity" &&
                            <>
                                <td></td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>

                            }
                           
                            </tr>
                            ))}
                            <tr>
                                <td>Total: </td>
                                <td>${numberWithCommas(debits)}</td>
                                <td>${numberWithCommas(credits)}</td>
                            </tr>
                        </tbody>
                        
                    </Table>
                    {showAlert === true &&
           
           <Alert variant={alert} />
               }
                   </div>
                     </>

        </div>
        </>
    )
}