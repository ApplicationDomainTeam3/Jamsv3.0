import React from "react";
import { collection} from "firebase/firestore";

import { useCollectionData } from 'react-firebase-hooks/firestore';
import {db} from './firestore';
import { AiFillFileText } from 'react-icons/ai';
import 'reactjs-popup/dist/index.css';
import {createSearchParams, useNavigate} from "react-router-dom"

export function ChildrenList({path, accountName}){

    const query1 = collection(db,  "journalEntries")
    const [docs, loading, error] = useCollectionData (query1);
    const journalsCollectionRef = collection(db,  "journalEntries");
     const navigate = useNavigate();



    /////////////Open attached document in a new tab/////////////
    const openInNewTab = (url) => {
        console.log(url);
        window.open(url);
      };
  
    


      ////////////////////////Open journal entry by clicking Post reference////////////////////

      const openJournal = (path, id) => {
        navigate({
            pathname: "journalentry",
            search: createSearchParams({
                path: path,
                id: id
            }).toString()
           
        })
    };
    

     //function for displaying cash amounts with commas where appropriate. Math.round...tofixed(2) makes it display two decimal points
     function numberWithCommas(x) {

        return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
       <>
                
       {docs?.map((doc)=>(
        
            <tr key={Math.random()}>
                {doc.approved ===  `approved` &&
                <>
                {doc.debits.map((debitdoc)=>
                    <>
                    {debitdoc.account === accountName && 
                        <>
                        <td>{doc.jeNumber}</td>
                        <td>{doc.user}</td>
                        <td>${numberWithCommas(debitdoc.debit)}</td>
                        <td></td>
                        <td>{doc.description}</td>
                        <td>{doc.dateTime}</td>
                        <td> {doc.files.length > 0 &&
                            <button role="link" className="custom-button-je" onClick={() => openInNewTab(doc.files)}><AiFillFileText size={25}/></button>
                            }
                        </td>
                        <td>
                            <button className="link-btn" onClick={()=>openJournal("journalEntries", doc.jeNumber)}>{doc.pr}</button>
                        </td>
                        </>
                    }
                
                    </>  
                )}
                  {doc.credits.map((creditdoc)=>   
                    <>
                        {creditdoc.account === accountName &&
                        <>
                        <td>{doc.jeNumber}</td>
                        <td>{doc.user}</td>
                        <td></td>
                        <td>${numberWithCommas(creditdoc.credit)}</td>
                        <td>{doc.description}</td>
                        <td>{doc.dateTime}</td>
                        <td> {doc.files.length > 0 &&
                            <button role="link" className="custom-button-je" onClick={() => openInNewTab(doc.files)}><AiFillFileText size={25}/></button>
                            }
                        </td>
                        <td>
                            <button className="link-btn" onClick={()=>openJournal(path, doc.jeNumber)}>{doc.pr}</button>
                        </td>
                        </>
                    }

                    
                    </>
                     
                     
                  )}  
                </>
                
                
                }
                
            </tr>
        ))}
       </>
        
    );
}
      
