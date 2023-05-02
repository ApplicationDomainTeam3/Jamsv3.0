import React, {useState, useEffect} from 'react'
import {db} from './firestore';
import Table from 'react-bootstrap/Table';
import { variants } from "./variants"
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { createSearchParams, useNavigate} from "react-router-dom"


export const DashMessages = () => {

    const journalEntriesref = collection(db,  "journalEntries");
    const [docs] = useCollectionData (journalEntriesref);
    const [jewaiting, setjewaiting] = useState(false);
    const [balanceMessage, setBalanceMessage] = useState()
    const q = query(journalEntriesref, where("approved", "==", "pending"))
    
    useEffect(()=>{

        const getMessages = async () =>{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                
                if(doc.exists())
                {
                    setjewaiting(true)
                }
            })
           
        }
        getMessages();
    },[jewaiting])
   


    
    return(
        <>
        <Table>
            <thead>
                <tr>
                </tr>
            </thead>
            <tbody>
                {jewaiting &&
                <>
                <td><h4>New Journal Entries waiting for approval!</h4></td>
                </>
                }
                <tr>

                </tr>
           
            </tbody>
        </Table>
        </>
    )

}