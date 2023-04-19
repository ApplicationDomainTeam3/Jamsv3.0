///////////Created by Ashly////////////////
import React from "react";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {db} from './firestore';
import { AiFillFileText } from 'react-icons/ai';
import 'reactjs-popup/dist/index.css';
import {Link, createSearchParams, useNavigate} from "react-router-dom"






export function ChildrenList({path}){

    const query = collection(db, path)
    const [docs, loading, error] = useCollectionData (query);

    const navigate = useNavigate();

    /////////////Open attached document in a new tab/////////////
    const openInNewTab = (url) => {
        console.log(url);
        window.open(url);
      };
        ////////////Print Debits//////////////
   const printDebits = (array) => {
    
   
    const listItems = array.map((d) => <li  key={d.debit}>${numberWithCommas(d.debit)}</li>);
   
    return listItems
   }
        ////////////Print Credits//////////////
        const printCredits = (array) => {
    
   
            const listItems = array.map((d) => <li  key={d.credit}>${numberWithCommas(d.credit)}</li>);
           
            return listItems
           }
            ////////////Print Account//////////////
   const printAccount = (array) => {
    
   
    const listItems = array.map((d) => <li  key={d.account}>{d.account}</li>);
   
    return listItems
   }
    


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
     
       {docs?.map((doc, idx)=>(
        <tr key={Math.random()}>
           
                <td >{idx+1}</td>
                <td>{doc.user}</td>
                
                <td>{printAccount(doc.debits)}</td>
                <td>{printDebits(doc.debits)}</td>
                <td>{printAccount(doc.credits)}</td>
                <td >{printCredits(doc.credits)}</td>
                
                <td >{doc.description}</td>
                <td>{doc.dateTime}</td>
                <td> {doc.files.length > 0 &&
                        <button role="link" className="custom-button-je" onClick={() => openInNewTab(doc.files)}><AiFillFileText size={25}/></button>
                    }
                </td>
                <td>
                    <button className="link-btn" onClick={()=>openJournal(path, doc.jeNumber)}>{doc.pr}</button>
                </td>
                
             
   
  


                    
                    
                
                
        </tr>
        ))}
       </>
        
    );
}
      
