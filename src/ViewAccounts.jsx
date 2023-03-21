import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { IoIosCreate } from 'react-icons/io';
import {Link, createSearchParams, useNavigate} from "react-router-dom"
import { ImWarning } from 'react-icons/im';
import Table from 'react-bootstrap/Table';
import menuLogo from './img/JAMS_1563X1563.png'






export const ViewAccounts = () =>{


    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const accountsCollectionRef = collection(db,  "accounts");
    const [editbox, seteditbox] = useState(false);
    

  

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
        
        <>
      
        <div className="view-accounts-container"> 
            
                    <>
                    
                    <h2>Chart of Accounts</h2>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Balance</th>
                            <th>Edit</th>
                            <th>Deactivate</th>

                            </tr>
                        </thead>
                        <tbody>
                            {accounts && accounts.map((account) => (
                            <tr key={account.id}>
                            <td>{account.number}</td>
                            <td>{account.name}</td>
                            <td>{account.category}</td>
                            <td>{numberWithCommas(account.balance)}</td>
                            <td>
                                <a onClick={()=>{openLedger(account.id)}}><IoIosCreate size={15}/></a>
                            </td>
                            <td><Link onClick={() => {deactivateAccount(account.id)}} className="va-button">
                                    <a><ImWarning size={15}/></a>
                                </Link>
                            </td>
                           
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/**
                        <h3>name</h3>
                        <div id="name" type="name" name="name"><p>{account.name}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field 
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

                        {/**when edit button is clicked, edit box appears to edit field 
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

                        {/**when edit button is clicked, edit box appears to edit field 
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

                        {/**when edit button is clicked, edit box appears to edit field
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

                        {/**when edit button is clicked, edit box appears to edit field 
                        {editbox === true && <div>
                            <p>edit category</p>
                            <input  onChange={(event) => {setNewCategory(event.target.value)}} />
                            <button onClick={()=> { 
                                editCategory(account.id, account.category, newCategory)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

  
                        <h3>InitialBalance</h3>
                        <div><p>{numberWithCommas(account.initialBalance)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field 
                        {editbox === true && <div>
                            <p>edit initial balance</p>
                            <input  onChange={(event) => {setNewIB(event.target.value)}} />
                            <button onClick={()=> { 
                                editIB(account.id, account.IB, newIB)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

                        <h3>Balance</h3>
                        <div><p>{numberWithCommas(account.balance)}</p></div>
                        
                        <h3>Description</h3>
                        <div> <p>{account.description}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field 
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


                        
                        
                        
                        
                    
                    <br />

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

                */}
                    </>

                    
                    
                
        </div>
        </>
    )
}