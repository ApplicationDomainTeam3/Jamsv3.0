import { useState, useEffect, useRef } from "react";
import {db} from './firestore';
import { collection, getDocs, doc, setDoc, getCountFromServer } from "firebase/firestore"
import { usersCollectionRef } from './firebase';
import { query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { variants } from "./variants";
import { Table } from "react-bootstrap";


export const BSData = () =>{
   
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
    const [currentRatio, setcurrencyRatio] = useState(0)
    const [equityperctotal, setequityperctotal] = useState(0);

    
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
            setcurrencyRatio(currentRatio)
            setequityperctotal(equityperctotal)
            if(currentRatio > 1)
            {
                document.getElementById("cr").style.color = "#0dd400";
                document.getElementById("cr").style.backgroundColor= "#e0ffde";
                document.getElementById("cr").style.opacity = "0.7"; 
            }
            else if(currentRatio > .5 && currentRatio <= 1)
            {
                document.getElementById("cr").style.color = "#e88000";
                document.getElementById("cr").style.backgroundColor= "#f8fa75";
                document.getElementById("cr").style.opacity = "0.7"; 
            }
            else if(currentRatio <= 0.5)
            {
                document.getElementById("cr").style.color = "#c91704";
                document.getElementById("cr").style.backgroundColor= "#ffec96";
                document.getElementById("cr").style.opacity = "0.7";             }
            if(equityperctotal*100 > 50)
            {
                document.getElementById("epc").style.color = "#0dd400";
                document.getElementById("epc").style.backgroundColor= "#e0ffde";
                document.getElementById("epc").style.opacity = "0.7";             }
            else if(equityperctotal*100 > 25 && equityperctotal*100 <= 50)
            {
                document.getElementById("epc").style.color = "#e88000";
                document.getElementById("epc").style.backgroundColor= "#fadbb4";
                document.getElementById("epc").style.opacity = "0.7"; 
            }
            else if(equityperctotal*100 <= 25)
            {
                document.getElementById("epc").style.color = "#c91704";
                    document.getElementById("epc").style.backgroundColor= "#f07f73";
                    document.getElementById("epc").style.opacity = "0.7"; 
            }
           
        }
       

        getBalanceSheet(refid);
        
    }, []); 


  
   
 
   

    return(
        <>
        

            <div id="cr">
           <Table>
                <tbody>
                    <tr>
                        <td>
                        <h4 >Current Ratio:</h4>
                        </td>
                        <td>
                        <h4 >{currentRatio.toFixed(2)}</h4>
                        </td>

                    </tr>
                </tbody>
            </Table>
            </div>
            <div id="epc">
            <Table>
                <tbody>
                    <tr>
                        <td>
                        <h4 >Equity as</h4>
                        <h4 > Percentage of Total:</h4>
                        </td>
                        <td ><h4 >{equityperctotal.toFixed(2)*100}%</h4></td>
                    </tr>
                </tbody>
            </Table>
            </div>
        </>
        
      
    )
}