import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { IoIosCreate } from 'react-icons/io';
import {Link} from "react-router-dom"
import { async } from "@firebase/util";
import { ImWarning } from 'react-icons/im';
import {EditAccount} from './EditAccount';



export const ViewAccounts = () =>{


    const [accounts, setAccounts] = useState([]);
    const accountsCollectionRef = collection(db,  "accounts");
    const [editbox, seteditbox] = useState(false);
    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState(0)
    const [newCategory, setNewCategory] = useState("")
    const [newCredit, setNewCredit] = useState(0)
    const [newDebit, setNewDebit] = useState(0)
    const [newIB, setNewIB] = useState("")
    const [newDescription, setNewDescription] = useState("")


    const deactivateAccount = async (id) => {
        const accountDoc = doc(db, "accounts", id);
        await deleteDoc(accountDoc);
        alert("Account deactivated. Refresh to view changes");


    }

    //Functions for editing data fields
    const editName = async (id, name, newName) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {name: newName}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editNumber = async (id, number, newNumber) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {number: newNumber}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editCategory = async (id, category, newCategory) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {category: newCategory}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editCredit = async (id, credit, newCredit) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {credit: newCredit}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editDebit = async (id, debit, newDebit) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {debit: newDebit}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editIB = async (id, IB, newIB) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {IB: newIB}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }
    const editDesc = async (id, description, newDescription) => {
        const accountDoc = doc(db, "accounts", id)
        const newFields = {description: newDescription}
        await updateDoc( accountDoc, newFields)
        alert("Account updated. Refresh to view changes");
    }

    useEffect(() => {

        const getAccounts = async () => {
            const data = await getDocs(accountsCollectionRef);
            setAccounts(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
        };

        getAccounts();
    }, []);

    //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
    function numberWithCommas(x) {

        let num = x;
        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   

    return(
        //Display account info
        <div className="view-accounts-container"> 
            {accounts.map((account) => { 
                return (
                    <>
                    <div className="view-accounts-row">
                        <h3>name</h3>
                        <div id="name" type="name" name="name"><p>{account.name}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit name</p>
                            <input placeholder="Name..." onChange={(event) => {setNewName(event.target.value)}} />
                            <button onClick={()=> { 
                                editName(account.id, account.name, newName)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        

                        <h3>number</h3>
                        <div><p>{account.number}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit number</p>
                            <input  onChange={(event) => {setNewNumber(event.target.value)}} />
                            <button onClick={()=> { 
                                editNumber(account.id, account.number, newNumber)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        <h3>credit</h3>
                        <div><p>{numberWithCommas(account.credit)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit credit</p>
                            <input  onChange={(event) => {setNewCredit(event.target.value)}} />
                            <button onClick={()=> { 
                                editCredit(account.id, account.credit, newCredit)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

                        <h3>debit </h3>
                        <div><p>{numberWithCommas(account.debit)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit debit</p>
                            <input  onChange={(event) => {setNewDebit(event.target.value)}} />
                            <button onClick={()=> { 
                                editDebit(account.id, account.debit, newDebit)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        

                        <h3>Category </h3>
                        <div><p>{account.category}</p> </div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit category</p>
                            <input  onChange={(event) => {setNewCategory(event.target.value)}} />
                            <button onClick={()=> { 
                                editCategory(account.id, account.category, newCategory)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

  
                        <h3>InitialBalance</h3>
                        <div><p>{numberWithCommas(account.initialbalance)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit initial balance</p>
                            <input  onChange={(event) => {setNewIB(event.target.value)}} />
                            <button onClick={()=> { 
                                editIB(account.id, account.IB, newIB)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        
                        <h3>Description</h3>
                        <div> <p>{account.description}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit description</p>
                            <input  onChange={(event) => {setNewDescription(event.target.value)}} />
                            <button onClick={()=> { 
                                editDesc(account.id, account.category, newDescription)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

                        <Link onClick={() => {deactivateAccount(account.id)}} className="va-button">
                            <a><h4>deactivate</h4><ImWarning size={30}/></a>
                        </Link>
                        <br />


                        
                        
                        
                        
                    </div>
                    <br />
                    </>

                    )
                    
                })}
        </div>

    )
}
