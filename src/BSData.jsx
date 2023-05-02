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
    const [newDateTime, setNewDateTime] = useState(Date)
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
           
        }
       

        getBalanceSheet(refid);
        
    }, []); 


  
   
 
   

    return(
        <>
        

        
           <Table>
                <tbody>
                    <tr>
                        <td>
                        <h4>Current Ratio:</h4>
                        </td>
                        <td><h4>{currentRatio.toFixed(2)}</h4></td>

                    </tr>
                </tbody>
            </Table>
            <Table>
                <tbody>
                    <tr>
                        <td>
                        <h4>Equity as Percentage of Total:</h4>
                        </td>
                        <td><h4>{equityperctotal}%</h4></td>
                    </tr>
                </tbody>
            </Table>
        </>
        
      
    )
}