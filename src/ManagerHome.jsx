import { IoIosCreate } from 'react-icons/io';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { ImEye } from 'react-icons/im';
import { ImWarning } from 'react-icons/im';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BiAddToQueue} from 'react-icons/bi';
import {AiFillCheckCircle} from  'react-icons/ai'
import {TrialBalance} from './TrialBalance'
import {FaBalanceScaleLeft} from 'react-icons/fa'
import { Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { db } from './firestore';
import { collection} from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';



export const ManagerHome = (props) => {

    const [frdata, setfrdata] = useState([]);
    const query = collection(db, "financial-ratios-data");
    const docs = useCollectionData(query)
  


    return (
        <>
        <div className='dash-container'>
            <div className="dashbox">
            <Link to="createje">
                <div className = "card">
                    <h3>Create<br></br>Journal Entries</h3>
                    <br></br>
                    < IoIosCreate size={50}/>
                </div>
            </Link>
                <Link to="viewaccounts">
                    <div className = "card">
                        <h3>View<br></br> Accounts</h3>
                        <br></br>
                        <ImEye size={50}/>
                    </div>
                </Link>
            </div> 
            <div className="dashbox">
                <Link to='apprejje'>
                    <div className = "card">
                        <h3>Approve/Reject<br></br>Journal Entries</h3>
                        <br></br>
                        <AiFillCheckCircle size={50}/>
                    </div>
                </Link>
                <Link to="financialreport">
                    <div className = "card">
                        <h3>Financial</h3>
                        <h3>Report</h3>
                        <br></br>
                        <FaBalanceScaleLeft size={50}/>
                    </div>
                </Link>  
            </div>
            
        </div>
        

        </>
        
        );
}

