import { useState, useEffect } from "react";
import {db} from './firestore';
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { IoIosCreate } from 'react-icons/io';
import {Link} from "react-router-dom"
import { async } from "@firebase/util";
import { ImWarning } from 'react-icons/im';




export const ViewUsers = () =>{


    const [users, setusers] = useState([]);
    const usersCollectionRef = collection(db,  "users");
    const [editbox, seteditbox] = useState(false);
    const [newFName, setNewFName] = useState("")
    const [newLName, setNewLName] = useState(0)
    const [newRole, setNewRole] = useState("")

    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const [newBDay, setNewBDay] = useState(0)
 


    const deactivateuser = async (id) => {
        const userDoc = doc(db, "users", id);
        await deleteDoc(userDoc);
        alert("user deactivated. Refresh to view changes");


    }

    //Functions for editing data fields
    const editFName = async (id, firstName, newFName) => {
        const userDoc = doc(db, "users", id)
        const newFields = {firstName: newFName}
        await updateDoc( userDoc, newFields)
        alert("user updated. Refresh to view changes");
    }
    const editLName = async (id, lastName, newLName) => {
        const userDoc = doc(db, "users", id)
        const newFields = {lastName: newLName}
        await updateDoc( userDoc, newFields)
        alert("user updated. Refresh to view changes");
    }
    const editBDay = async (id, birthday, newBDay) => {
        const userDoc = doc(db, "users", id)
        const newFields = {birthday: newBDay}
        await updateDoc( userDoc, newFields)
        alert("user updated. Refresh to view changes");
    }
    const editPassword = async (id, password, newPassword) => {
        const userDoc = doc(db, "users", id)
        const newFields = {password: newPassword}
        await updateDoc( userDoc, newFields)
        alert("user updated. Refresh to view changes");
    }
    const editRole = async (id, role, newRole) => {
        const userDoc = doc(db, "users", id)
        const newFields = {role: newRole}
        await updateDoc( userDoc, newFields)
        alert("user updated. Refresh to view changes");
    }
    
    useEffect(() => {

        const getusers = async () => {
            const data = await getDocs(usersCollectionRef);
            setusers(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
        };

        getusers();
    }, []);


    return(
        //Display user info
        <div className="view-users-container"> 
            {users.map((user) => { 
                return (
                    <>
                    <div className="view-users-row">
                        <h3>First Name</h3>
                        <div id="name" type="name" name="name"><p>{user.firstName}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit first name</p>
                            <input placeholder="Name..." onChange={(event) => {setNewFName(event.target.value)}} />
                            <button onClick={()=> { 
                                editFName(user.id, user.firstName, newFName)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        

                        <h3>Last Name</h3>
                        <div><p>{user.lastName}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit last namer</p>
                            <input  onChange={(event) => {setNewLName(event.target.value)}} />
                            <button onClick={()=> { 
                                editLName(user.id, user.lastName, newLName)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        <h3>Birthday</h3>
                        <div><p>{(user.birthday)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit birthday</p>
                            <input  onChange={(event) => {setNewBDay(event.target.value)}} />
                            <button onClick={()=> { 
                                editBDay(user.id, user.credit, newBDay)
                                seteditbox(false)
                            }}>update</button>
                        </div>}

                        <h3>Role </h3>
                        <div><p>{(user.role)}</p></div>
                        <Link onClick={() => {seteditbox(true)}} className="va-button">
                            <a><IoIosCreate size={30}/></a>
                        </Link>

                        {/**when edit button is clicked, edit box appears to edit field */}
                        {editbox === true && <div>
                            <p>edit role</p>
                            <input  onChange={(event) => {setNewRole(event.target.value)}} />
                            <button onClick={()=> { 
                                editRole(user.id, user.role, newRole)
                                seteditbox(false)
                            }}>update</button>
                        </div>}
                        

                        

                        <Link onClick={() => {deactivateuser(user.id)}} className="va-button">
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
