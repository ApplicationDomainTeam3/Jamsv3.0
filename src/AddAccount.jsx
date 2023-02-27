import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, addDoc} from "firebase/firestore"

export const accountsCollectionRef = collection(db,  "accounts");

export const AddAccount = () =>{

    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState(0)
    const [newCategory, setNewCategory] = useState("")
    const [newCredit, setNewCredit] = useState(0)
    const [newDebit, setNewDebit] = useState(0)
    const [newIB, setNewIB] = useState("")
    const [newDescription, setNewDescription] = useState("")




    const [accounts, setAccounts] = useState([]);
   
    const createAccount = async () => {
        await addDoc(accountsCollectionRef, {name: newName, number: newNumber, category: newCategory, credit: newCredit, debit: newDebit, initialBalance: newIB, description: newDescription})
    }

   

    return(
        <>
        <div className="aa-form-container">
            <h2>Add Account</h2>
            <form className="addaccount-form" > 
                <input placeholder="Name..." onChange={(event) => {setNewName(event.target.value)}} />
                <input type="number" placeholder="Number..." onChange={(event) => {setNewNumber(event.target.value)}} />
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