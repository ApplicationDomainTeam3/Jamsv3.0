import React, {useState, useEffect} from 'react'
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {db} from './firestore';
import { async } from "@firebase/util";
import { useSearchParams, Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import menuLogo from './img/JAMS_1563X1563.png'
import { BsHandThumbsUpFill } from 'react-icons/bs';
import { Alert } from "./Alert"
import { variants } from "./variants"
import { collection } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';

export const AppRejJE = () => {

    const journalEntriesref = collection(db,  "journalEntries");
    const [docs, loading, error] = useCollectionData (journalEntriesref);
    const [newDateTime, setNewDateTime] = useState(Date)
    const [alert, setAlert] = useState(variants.at(0))
    const [showAlert, setShowAlert] = useState(false)

    const [approval, setApproval] = useState("");

    const approve = async (jeNumber, value) => {
        const journaldoc = doc(db, "journalEntries", jeNumber)
        const newFields = {approve: value, dateTime: newDateTime}
        await updateDoc( journaldoc, newFields)
        setAlert(5)
        setShowAlert(true)
       
    }
       //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
       function numberWithCommas(x) {

        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return(
        <>
        <div className='approval-container'>
            <h2>Approve/Reject Journal Entries</h2>
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Posted by</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Post Reference</th>
                    <th>Approval<br/>Status</th>
                    <th>Approve/<br/>Reject</th>
                </tr>
            </thead>
            <tbody>
            {docs?.map((doc)=>(
                <tr key={Math.random()}>
                    <td>{doc.jeNumber}</td>
                    <td>{doc.user}</td>
                    <td>
                    {doc.debits.map((debitdoc)=>
                        <>
                        <li>${numberWithCommas(debitdoc.debit)}</li>
                        <li>{debitdoc.account}</li>
                        </>
                )}
                    </td>
                   <td>
                   {doc.credits.map((creditdoc)=>   
                    <>
                        <li>${numberWithCommas(creditdoc.credit)}</li>
                        <li>{creditdoc.account}</li>
                    </>
                  )}  
                   </td>
                 
                    <td>{doc.description}</td>
                    <td>{doc.dateTime}</td>
                    <td>{doc.pr}</td>
                    <td>{doc.approved}</td>
                    {console.log("the docs number is: ", doc.jeNumber)}
                    <td> <select value={approval} onChange={(e) => approve(doc.jeNumber, e.target.value)}>
                            <option value="default">approve/reject</option>
                            <option value="approve">approve</option>
                            <option value="reject">reject</option>
                        </select>
                     </td>
                  
                </tr>
            ))}
            </tbody>
        </Table>
        {showAlert === true &&
           
           <Alert variant={alert} />
          }
        </div>
        </>
    )

}