import { useSearchParams, } from "react-router-dom";
import { useEffect, useState } from "react";
import {db} from './firestore';
import {doc, getDoc} from "firebase/firestore"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Table } from "react-bootstrap";
import { AiFillFileText } from 'react-icons/ai';


export const JournalEntry = ()=>{

    const [searchparams] = useSearchParams();
    

    let journalID = searchparams.get("id")
    let path = searchparams.get("path")
    console.log("The journal id is  ", journalID)
   

    const [user, setUser] = useState('')
    const [postref, setpostRef] = useState('')
    const [account, setAccount] = useState('')
    const [credits, setCredits] = useState([])
    const [debits, setDebits] = useState([])
    const [description, setDescription] = useState("")
    const [jeNum, setjeNum] = useState(0);
    const [date, setDate] = useState("");
    const [files, setFiles] = useState("");

    useEffect(() => {

        let id = journalID
        const getAccount =  async (id, path) => {
            const journalDoc = doc(db, path, id);
            const docSnap = await getDoc(journalDoc);
            const data = docSnap.data();
            setDescription(data.description)
            setUser(data.user);
            setpostRef(data.pr)
            setAccount(data.debits[0].account)
            setDebits(data.debits);
            setCredits(data.credits);
            setjeNum(data.jeNumber)
            setDate(data.dateTime)
            setFiles(data.files)
            
            console.log(data)

           
        }

        getAccount(id, path);
        
    }, []); 

    const openInNewTab = (url) => {
        console.log(url);
        window.open(url);
      };

return(
    <div>
                            <>
                    
                    <h1>Journal Entry</h1>
                    <Table responsive striped bordered >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Accounts</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>{jeNum}</td>
                            <td>{account}</td>
                            <td>
                                {debits.map((doc)=>{
                                    {console.log(doc.debit)}
                                 
                                })}
                            </td>
                            <td> {credits?.map((doc)=>{
                                    <li>{doc.credit}</li>
                                })}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table responsive striped bordered >
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Created By</th>
                                <th>Created</th>
                                <th>Post Reference</th>
                                <th>Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>{description}</td>
                            <td>{user}</td>
                            <td>{date}</td>
                            <td>{postref}</td>
                            <td>{files.length > 0 &&
                                    <button role="link" className="custom-button-je" onClick={() => openInNewTab(files)}><AiFillFileText size={25}/></button>
                                    }
                            </td>
                            </tr>
                        </tbody>
                    </Table>
                     </>
        
        
    </div>
)


}