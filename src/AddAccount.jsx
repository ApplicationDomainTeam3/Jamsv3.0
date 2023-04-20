import {db} from './firestore';
import { collection,  addDoc, query, where, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import { auth } from './firebase';
import { onAuthStateChanged} from 'firebase/auth';
import React, {useRef, useState, useEffect}from 'react'
import { doc, setDoc, updateDoc, getCountFromServer} from "@firebase/firestore";
import { Container } from '@mui/material';
import { TextField } from '@mui/material';
import { AiOutlinePlusSquare} from "react-icons/ai";
import { AiOutlineMinusSquare} from "react-icons/ai";
import { BiUpload } from 'react-icons/bi';
import { IoIosCreate } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';






export const accountsCollectionRef = collection(db,  "accounts");

export const AddAccount = () =>{

    
    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState(0)
    const [newCategory, setNewCategory] = useState("")
    const [newCredit, setNewCredit] = useState(0)
    const [newDebit, setNewDebit] = useState(0)
    const [newIB, setNewIB] = useState(0)
    const [newDescription, setNewDescription] = useState("")
    const [newDateTime, setNewDateTime] = useState(Date)
    const [authUser, setAuthuser] = useState(null);
    const [refid, setrefid] = useState('')
    const [approved, setApproved] = useState(false);
    const [postReference, setPostReference] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    //const [balance, setBalance] = useState(0)
    const usersCollectionRef = collection(db, 'users');
    const [userUID, setuserUID] = useState("")



    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthuser(user) //if user us logged in, set authuser to the logged in user
            }else{
                setAuthuser(null);//otherwise authuser is null
            }
        });

        return () => {
            listen();
        }

    }, []);
    /////////////////generate journal entry number and post reference////////////////////////
useEffect(() => {

    const getCount =  async () => {
        
        const coll = collection(db, "journalEntries");
        const snapshot = await getCountFromServer(coll);
        console.log(snapshot.data());
        
        console.log(snapshot.data().count);
        setrefid(snapshot.data().count.toString());
        console.log("the new ref id is ", refid)
        setPostReference(uuidv4().toString());
        console.log("The PR is ", postReference)
        
        
       
    }
    getCount();
    
}, [refid]); 
    
  
    
    //querying the database for duplicate entries
    const checkDup = async (nameChk) => {
        
        let dup = false;

    }
    const navigate = useNavigate();
    const numCheck = new RegExp(/^\+?(0*[1-9]\d*(?:[\., ]\d+)*) *(?:\p{Sc}|°[FC])?$/mg) //regular expression for checking if input is a positive integer


    //check that account number is a positive integer
    const accntnumChk =  (e) => {
        
        if (numCheck.test(e)) 
            setNewNumber(e)
      };

    //calculate the new balance on the account
    const sumDebit = (array) =>
        {
            let dtotal = 0;
            array.map((d) => {dtotal +=parseFloat(d.debit);
            console.log("the total is: ", dtotal)});
            return parseFloat(dtotal)
        }
        const sumCredit = (array) =>
        {
            let dtotal = 0;
            array.map((d) => {dtotal +=parseFloat(d.credit);
            console.log("the total is: ", dtotal)});
            return parseFloat(dtotal)
        }

    const [accounts, setAccounts] = useState([]);
   
//////////////////Create Account ////////////////////////////////
    const createAccount = async (e) => {
        e.preventDefault()

        handleChangeCredit()
        let dupAccount = false;
        let debitSum = sumDebit(debitInputs)
        console.log("the debit sum is", debitSum)
        let creditSum = sumCredit(creditInputs)
        console.log("the credit sum is", creditSum)
        setNewCredit(creditSum);
        setNewDebit(debitSum);
        const balance = parseFloat(debitSum - creditSum)
        //dupAccount = checkDup(newName);
        
    //check to make sure valid entries for name and number have been entered, if so create account
    if(newName !== '' && newNumber !== 0 && dupAccount === false){
            await addDoc(accountsCollectionRef, {name: newName, number: newNumber, category: newCategory, credit: creditSum, debit: debitSum, initialBalance: newIB, balance: balance, description: newDescription, dateTime: newDateTime, user: authUser.email})

      
                if(debitInputs.at(0).debit > 0 && creditInputs.at(0).credit > 0){
                    const docRef=doc(db, "journalEntries", refid);
                    await setDoc(docRef, {jeNumber: refid,  debits: debitInputs, credits: creditInputs, description:newDescription,  dateTime: newDateTime, approved: approved, pr: postReference, user: username, role: role});
                    alert("Journal Entry Posted")
                }
                else{
                    alert("Journal entry must contain at least one debit and credit")
                }
            
           
            navigate("/home/viewaccounts");}
        else if(dupAccount === true){
            alert("Account exists")}
        else{
            alert("Enter valid name/number")
        }

    }
/////////////////////////////get the user that posts the journal entry//////////////////////
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
                setUsername(data.username)
                
            })
            
        }else{
            setAuthuser(null);//otherwise authuser is null
            
        }
        
        
    });

    return () => {
        listen();
    }

}, [authUser, userUID, role]);

//////////// debits form ///////////////
const [debitInputs, setDebitInput] = useState([
    { id: uuidv4(), debit: 0.00, account: ""},
   
]);

const handleChangeDebit = (id, event) => {
   const newDebitInputs = debitInputs.map(i => {
    if(id === i.id) {
        i[event.target.name] = event.target.value
        
    }
    
    return i;
   })
   
   setDebitInput(newDebitInputs)
   console.log("the debit inputs are now: ",debitInputs)
}



const handleAddDeb = (e) => {
    e.preventDefault()
    setDebitInput([...debitInputs, {id: uuidv4(), debit: 0, account: ""}])
}
const handleRemDeb = (e, id) => {
    e.preventDefault();
    const values = [...debitInputs];
    values.splice(values.findIndex(value => value.id === id), 1);    setDebitInput(values);

}
//////////// credits form ///////////////
const [creditInputs, setCreditInput] = useState([
    { id: uuidv4(), credit: 0.00, account: ""},
   
]);

const handleChangeCredit = (id, event) => {
   const newcreditInputs = creditInputs.map(i => {
    if(id === i.id) {
        i[event.target.name] = event.target.value
        
    }
    
    return i;
   })
   console.log("the credit inputs are:", newcreditInputs)
   setCreditInput(newcreditInputs)
   
}



const handleAddCred = (e) => {
    e.preventDefault()
    setCreditInput([...creditInputs, {id: uuidv4(), credit: 0, account: ""}])
}
const handleRemCred= (e, id) => {
    e.preventDefault();
    const values = [...creditInputs];
    values.splice(values.findIndex(value => value.id === id), 1);    setCreditInput(values);

}


    return(
        <>
      
        <div className="aa-form-container">
        <h2>Add Account</h2>
          
            
            <form className="addaccount-form" > 
            <div className="je-box-2">
            <input type="text" placeholder="Account Name..."  onChange={(event) => {setNewName(event.target.value)} }  />

                <input type="number" placeholder="Number..."  onChange={(event) => {accntnumChk(event.target.value)}}  />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                <option value="default">category...</option>
                    <option value="asset">asset</option>
                    <option value="liability">liability</option>
                    <option value="expense">expense</option>
                    <option value="equity">equity</option>
                </select>
            </div>
               
    
              
                <div className="je-box-1">

                <label htmlFor="debits">Debits</label>
                    <div className="debit-container">

                        <Container>
                        
                                { debitInputs.map((debitInput)=>(
                                    <div className="debit-form" key={debitInput.id}>
                                         <TextField 
                                            name="debit"
                                            label="debit"
                                            variant="filled"

                                            onChange={event => handleChangeDebit(debitInput.id, event)}
                                         />
                                
                                        <div className='addrem'>
                                            <button className='custom-button-je' onClick={(e)=> handleAddDeb(e)}><AiOutlinePlusSquare size={20}/></button>
                                            <button className='custom-button-je'disabled={debitInputs.length === 1} onClick={(e)=> handleRemDeb(e, debitInput.id)}><AiOutlineMinusSquare size={20}/></button>
                                        </div>
                                       
                                    </div>
                                ))}
                              
                        </Container>
                        
                    </div>
                    <label htmlFor="credits">Credits</label>
                    <div className="debit-container">
                        <Container>
                                    
                                { creditInputs.map((creditInput)=>(
                                    <div className="debit-form" key={creditInput.id}>
                                        <TextField 
                                            name="credit"
                                            label="credit"
                                            variant="filled"

                                            onChange={event=> handleChangeCredit(creditInput.id, event)}
                                        />
                                     
                                        <div className="addrem">
                                            <button className='custom-button-je' onClick={(e)=> handleAddCred(e)}><AiOutlinePlusSquare  size={20}/></button>
                                            <button className='custom-button-je'disabled={creditInputs.length === 1} onClick={(e)=> handleRemCred(e, creditInput.id)}><AiOutlineMinusSquare size={20}/></button>
                                        </div>
                                       
                                    </div>
                                ))}
                            
                             
                        </Container>

                    </div>
                       
           </div>
                <div className="je-box-1">
                <input type="ib" placeholder="initial balance..." onChange={(event) => {setNewIB(parseFloat(event.target.value))}}/>
                <input type="description" placeholder="description" onChange={(event) => {setNewDescription(event.target.value)}}/>
                  
                <button className="custom-button" onClick={(e)=> { 
                createAccount(e)
                }
                }>Add Account</button>             
                </div>
              
            </form>
           
            
        </div>
        
        </>

    )
}
