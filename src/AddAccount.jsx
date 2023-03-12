import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, addDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";


export const accountsCollectionRef = collection(db,  "accounts");

export const AddAccount = () =>{

    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState(0)
    const [newCategory, setNewCategory] = useState("")
    const [newCredit, setNewCredit] = useState(0)
    const [newDebit, setNewDebit] = useState(0)
    const [newIB, setNewIB] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const navigate = useNavigate();


    //check that account number is a positive integer
    const accntnumChk = (e) => {
        const regex = /^[0-9\b]+$/;
        if (regex.test(e.target.value)) {
          setNewNumber(e.target.value);
        }
        else{
            alert("invalid account number")
        }
      };


    const [accounts, setAccounts] = useState([]);
   
    const createAccount = async () => {
        
        await addDoc(accountsCollectionRef, {name: newName, number: newNumber, category: newCategory, credit: newCredit, debit: newDebit, initialBalance: newIB, description: newDescription})
        navigate("/adminhome/viewaccounts");

    }
    
   

    return(
        <>
        <div className="aa-form-container">
            <h2>Add Account</h2>
            <form className="addaccount-form" > 
                <input placeholder="Name..." onChange={(event) => {setNewName(event.target.value)}} />
                <input type="number" placeholder="Number..."  onChange={(event) => {accntnumChk(event.target.value)}}  />
                <input placeholder="category..." onChange={(event) => {setNewCategory(event.target.value)}} />
                <input type="credit" placeholder="credit amount..." onChange={(event) => {setNewCredit(event.target.value)}}/>
                <input type="debit" placeholder="debit amount..." onChange={(event) => {setNewDebit(event.target.value)}}/>
                <input type="ib" placeholder="initial balance..." onChange={(event) => {setNewIB(event.target.value)}}/>
                <input type="description" placeholder="description" onChange={(event) => {setNewDescription(event.target.value)}}/>
            </form>
            <button onClick={createAccount}>Add Account</button>
            
        </div>
        
        </>

    )
}