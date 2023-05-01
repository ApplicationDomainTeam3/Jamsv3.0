import { useState, useEffect, useRef } from "react";
import {db} from './firestore';
import { collection, getDocs, doc, setDoc, getCountFromServer } from "firebase/firestore"
import { usersCollectionRef } from './firebase';
import { query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Alert } from "./Alert";
import { variants } from "./variants";
import * as htmlToImage from 'html-to-image';

import Table from 'react-bootstrap/Table';

export const IncomeStatement = () =>{
   
    const [accounts, setAccounts] = useState([]);
    const accountsCollectionRef = collection(db,  "accounts");
    const [authUser, setAuthuser] = useState(null);
    const [role, setRole] = useState("")
    const [userUID, setuserUID] = useState("")
    const auth = getAuth();   
    const [alert, setAlert] = useState(variants.at(0))
    const [showAlert, setShowAlert] = useState(false) 
    const [newDateTime, setNewDateTime] = useState(Date)
    const [refid, setrefid] = useState(0);
    const domEl = useRef(null);
    const categories = ["Product Sales", "Cost of Goods Sold","Gross Profit/(Loss)", "Overhead Expenses", "Operating Profit/(Loss)"]
    const [productSales, setPS] = useState(0);
    const [costofGS, setCoGS] = useState(0);
    const [grossProfit, setGP] = useState(0);
    const [overheadExpenses, setOHE] = useState(0);
    const [operatingProfit, setOP] = useState(0);
    const [amounts, setamounts] = useState([]);
    const [movement, setMovement] = useState([])

    
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

        const getIncomeStatement =  async () => {
     
            let productSales = 0;
            let costofGS = 0;
            let overheadExpenses = 0;
            let grossProfit = 0;
            let operatingProfit = 0;

    //////Get product sales, cost of goods sold, and overhead expenses
            const querySnapshot = await getDocs(collection(db, "accounts"));
            
                    querySnapshot.forEach((doc) => {
                  
                    var data = doc.data();
                   if(data.name === "product sales")
                   { 
                    productSales += parseFloat(data.balance)
                    }
                    if( data.name === "inventory")
                   { 
                    costofGS += parseFloat(data.balance)
                  
                    }
                    if( data.category === "liability")
                    {
                        overheadExpenses += parseFloat(data.balance)
                    }
                    
                    });
                
            //Calculate gross profit and operating profit
                grossProfit = parseFloat(productSales - costofGS)
                operatingProfit = parseFloat(grossProfit-overheadExpenses)
                setamounts([productSales, costofGS,grossProfit, overheadExpenses, operatingProfit])
                const pschange = productSales-productSales
                const cogschange= costofGS-costofGS
                const ohechange =overheadExpenses-overheadExpenses
                const gpchange = grossProfit-grossProfit
                const opchange = operatingProfit-operatingProfit
                setMovement([pschange, cogschange,  gpchange,ohechange, opchange])
                    
           
        }

        getIncomeStatement();
        
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
                    <div className="column-container-is">
                    <h1>Income Statement</h1>
                    <button className="custom-button-tb" onClick={downloadReport}>Download Balance Sheet</button>
                    {showAlert === true &&
           
                        <Alert variant={alert} />
                    }
                    <div id="domEl" ref={domEl} className="income-statement-container">
                        
                 
                    <Table responsive striped bordered>

                        <thead>
                            <tr>
                            <th>Category</th>
                      
                            </tr>
                        </thead>
                       
                        <tbody >
                        {categories.map((d) =>
                        <tr key={Math.random()}>
                        <td>{d}</td>
                        </tr> 
                        )}
                        </tbody>
                    </Table>
                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th>Period 1</th>
                            </tr>
                        </thead>
                        <tbody >
                        {amounts.map((d) =>
                            <tr key={Math.random()}>
                                <td>{numberWithCommas(d)}</td>
                            </tr> 
                        )}
                        </tbody>

                    </Table>
                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th>Period 2</th>
                            </tr>
                        </thead>
                        <tbody >
                        {amounts.map((d) =>
                            <tr key={Math.random()}>
                                <td>{numberWithCommas(d)}</td>
                            </tr> 
                        )}
                        </tbody>

                    </Table>
                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th>movement</th>
                            </tr>
                        </thead>
                        <tbody >
                        {movement.map((d) =>
                            <tr key={Math.random()}>
                                <td>{d}</td>
                            </tr> 
                        )}
                        </tbody>

                    </Table>           
                    </div>
                    
              
                  
               </div>
        </div>
      
    )
}