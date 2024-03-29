import { useState, useEffect, useRef } from "react";
import {db} from './firestore';
import { collection, getDocs, doc, setDoc, addDoc, getCountFromServer } from "firebase/firestore"
import { usersCollectionRef } from './firebase';
import { query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Alert } from "./Alert";
import { variants } from "./variants";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import Table from 'react-bootstrap/Table';
import menuLogo from './img/JAMS_1563X1563.png'


export const BalanceSheet = () =>{
   
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
    const [newDateTime, setNewDateTime] = useState(new Date())
    const [refid, setrefid] = useState(0);
    const domEl = useRef(null);

    
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
/////////////////generate journal entry number////////////////////////
useEffect(() => {

    const getCount =  async () => {
        
        const coll = collection(db, "mnotifications");
        const snapshot = await getCountFromServer(coll);
        console.log(snapshot.data());
        
        console.log(snapshot.data().count);
        setrefid(snapshot.data().count.toString());
        console.log("the new ref id is ", refid)
    }
    getCount();
   

}, [refid]); 


    useEffect(() => {

        const getAccounts = async () => {
            const data = await getDocs(accountsCollectionRef);
            setAccounts(data.docs.map((doc) => ({...doc.data(), id: doc.id })));

        };

        getAccounts();
    }, []);

    useEffect(() => {

        const getBalanceSheet =  async (refid) => {
     
            let debitSum = 0;
            let creditSum = 0;
            let liabilitySum = 0;
            let equitySum = 0;
            let notification = "The accounts are not balanced! Assets must equal Liabilies + Equity!"

    //////Sum up debit accounts and credit accounts to get totals
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
                    if(data.category === "liability")
                    { 
                     liabilitySum += parseFloat(data.balance)
                     }

                    if(data.category === "equity")
                    {
                        equitySum += parseFloat(data.balance)
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
                const mnotifRef=doc(db, "mnotifications", refid.toString());
                await setDoc(mnotifRef, {notification: notification, dateTime: newDateTime})
                
            }
            const currentRatio = parseFloat(debitSum/creditSum)
            const equityperctotal = parseFloat(equitySum/debitSum)
           
        }
       

        getBalanceSheet(refid);
        
    }, []); 


    //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
    function numberWithCommas(x) {

        
        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /////////Download image of trial balance report////////////////////////

    const downloadReport = async () =>{
        const dataUrl = await htmlToImage.toPng(domEl.current);

       const link = document.createElement('a');
       link.download = "balance-sheet.png";
       link.href = dataUrl;
       link.click();
    }
   
   

    return(
       
                <div > 
                    <div className="column-container">
                    <h1>Balance Sheet</h1>
                    <button className="custom-button-tb" onClick={downloadReport}>Download Balance Sheet</button>
                    {showAlert === true &&
           
                        <Alert variant={alert} />
                    }
                    <div id="domEl" ref={domEl} className="balance-sheet-container">
                        
                    <div className="bs-table-container">
                    <Table responsive striped bordered>

                        <thead>
                            <tr>
                            <th>Current Assets</th>
                            <th>Amount</th>
                            </tr>
                        </thead>
                       
                        <tbody >
                            {accounts && accounts.map((account) => (
                            <tr key={account.id}>
                           
                            {account.category === "asset" &&
                            <>
                                <td>{account.name}</td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>
                            }

                            </tr>
                            ))}   
                        </tbody>
                        
                    </Table>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                            <td>Total: </td>
                              
                              <td>${numberWithCommas(debits)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </div>
                    <div className="bs-table-container">

                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th>Current Liabilities</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        {accounts && accounts.map((account) => (
                            <>
                            <tr>
                            {account.category === "liability"  &&
                           <>
                                <td>{account.name}</td>
                                 <td>${numberWithCommas(account.balance)}</td>
                                 </>
                            || account.category === "expense"  &&
                            <>
                                <td>{account.name}</td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>
                            }
                         
                            </tr>
                            </>
                             ))}
                        </tbody>
                    </Table>
                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th>Equity</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        {accounts && accounts.map((account) => (
                            <>
                            <tr>
                            {account.category === "equity" &&
                            <>
                                <td>{account.name}</td>
                                 <td>${numberWithCommas(account.balance)}</td>
                            </>

                            }
                         
                            </tr>
                            </>
                             ))}
                        </tbody>
                    </Table>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                            <td>Total: </td>
                              
                              <td>${numberWithCommas(credits)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </div>
                   </div>
                  
               </div>
        </div>
      
    )
}