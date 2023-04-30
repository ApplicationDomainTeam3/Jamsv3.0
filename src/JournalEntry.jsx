import { useSearchParams, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {db} from './firestore';
import {doc, getDoc, updateDoc} from "firebase/firestore"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Table } from "react-bootstrap";
import { AiFillFileText } from 'react-icons/ai';
import {AiOutlineSend} from 'react-icons/ai'
import { Alert } from "./Alert"
import { variants } from "./variants"



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
    const [alert, setAlert] = useState(variants.at(0))
    const [showAlert, setShowAlert] = useState(false)
    const [newDateTime, setNewDateTime] = useState(Date)



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
      const comment= useRef()
      const [showComment, setshowComment] = useState(false)
  
      const [approval, setApproval] = useState("");
  
      const approve = async (id, value) => {
          {console.log("the value is: ", value)}
          const journaldoc = doc(db, "journalEntries", id)
          if(value === "approved")
          {
              
              setAlert(variants.at(6))
              const newFields = {approved: value, dateTime: newDateTime}
              await updateDoc(journaldoc, newFields)
          }
         
          else
          {
              setApproval(value)
              setAlert(variants.at(11))
              setShowAlert(true)
              setshowComment(true)
          }
      }
      const submitRej = async (id, approval) => {
          
          if(comment.current.value==="")
          {
              setAlert(variants.at(11))
          }
          else{
              console.log("the comment is: ", comment.current.value)
          const journaldoc = doc(db, "journalEntries", id)
          const newFields = {approved: approval, dateTime: newDateTime, comment:comment.current.value}
          await updateDoc(journaldoc, newFields)
          setAlert(variants.at(7))
          }
  
      }

return(
    <div>
                            <>
                    
                    <h1>Journal Entry</h1>
                    {showAlert === true &&
           
                        <Alert variant={alert} />
                        }
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
                                <th>Approve/Reject</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>{description}</td>
                            <td>{user}</td>
                            <td>{date}</td>
                            <td>
                            {postref}
                        </td>
                            <td>{files.length > 0 &&
                                    <button role="link" className="custom-button-je" onClick={() => openInNewTab(files)}><AiFillFileText size={25}/></button>
                                    }
                            </td>
                            <td> <select value={approval} onChange={(e) => approve(jeNum, e.target.value)}>
                                <option value="default">approve/reject</option>
                                <option value="approved">approve</option>
                                <option value="rejected">reject</option>
                            </select>
                        {showComment && 
                                
                                <>
                                <input className="input-large" placeholder="enter reason for rejection..." ref={comment} />
                                <button className='custom-button2'onClick={()=> submitRej(jeNum, approval)}><AiOutlineSend size={20}/></button>
                                </>
                                }
                     </td>
                            </tr>
                        </tbody>
                    </Table>
                     </>
        
        
    </div>
)


}