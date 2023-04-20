import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { IoIosCreate } from 'react-icons/io';
import {Link, createSearchParams, useNavigate} from "react-router-dom"
import { ImWarning } from 'react-icons/im';
import { AiFillProfile } from 'react-icons/ai';

import Table from 'react-bootstrap/Table';
import menuLogo from './img/JAMS_1563X1563.png'

import { IoIosEye} from 'react-icons/io';





export const ViewAccounts = () =>{


    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const accountsCollectionRef = collection(db,  "accounts");
  
    

  

    const deactivateAccount = async (id) => {
        const accountDoc = doc(db, "accounts", id);
        
        const docSnap = await getDoc(accountDoc);
        const data = docSnap.data();
        const balance = data.balance


        if(balance < 0.01){
            await deleteDoc(accountDoc);
        alert("Account deactivated. Refresh to view changes");
        }
        else{
            
            alert("Account with remaining balance cannot be deactivated.");
        }
        
    }

    const openLedger = (x) => {
        navigate({
            pathname: "ledger",
            search: createSearchParams({
                id: x,
            }).toString()
           
        })
    };
    const editAccount = (x) => {
        navigate({
            pathname: "editAccount",
            search: createSearchParams({
                id: x,
            }).toString()
           
        })
    };
    

   
    useEffect(() => {

        const getAccounts = async () => {
            const data = await getDocs(accountsCollectionRef);
            setAccounts(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
        };

        getAccounts();
    }, []);

    //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
    function numberWithCommas(x) {

        
        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   

    return(
        //Display account info
        
        <>
      
        <div > 
            
                    <>
                    
                    <h1>Chart of Accounts</h1>
                    <div className="view-accounts-container">
                    <Table responsive striped bordered hover>
                   
                            
                           
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Created By</th>
                            <th>Last Updated</th>
                            <th>View<br/>Ledger</th>
                            <th>Edit</th>
                            <th>Deactivate</th>

                            </tr>
                        </thead>
                       
                        <tbody >
                            {accounts && accounts.map((account) => (
                            <tr key={account.id}>
                            <td>{account.number}</td>
                            <td>{account.name}</td>
                            <td>{account.category}</td>
                            <td>{account.description}</td>
                            <td>{account.user}</td>
                            <td>{account.dateTime}</td>
                            <td>
                                <button className="custom-button-va" onClick={()=>{openLedger(account.id)}}><AiFillProfile size={25}/></button>
                            </td>
                            <td>
                                <button className="custom-button-va" onClick={()=>{editAccount(account.id)}}><IoIosCreate size={25}/></button>
                            </td>
                            <td><button onClick={() => {deactivateAccount(account.id)}} className="custom-button-va">
                                    <ImWarning size={25}/>
                                </button>
                            </td>
                           
                            </tr>
                            ))}
                        </tbody>
                        
                    </Table>
                   </div>
                     </>

                    
                    
                
        </div>
        </>
    )
}