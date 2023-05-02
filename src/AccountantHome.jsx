import { IoIosCreate } from 'react-icons/io';
import { ImEye } from 'react-icons/im';
import { Link } from 'react-router-dom';
import {FaBalanceScaleLeft} from 'react-icons/fa'

export const AccountantHome = (props) => {

    return (
        <>
         <div className='dash-container'>
         <h1>Accountant Dashboard</h1>
            <div className="dashbox">
        
            <Link to="viewaccounts">
                <div className = "card">
                    <h3>View<br></br> Accounts</h3>
                    <br></br>
                    <ImEye size={50}/>
                </div>
            </Link>
            <Link to="viewje">
                <div className = "card">
                    <h3>View<br></br>Journal Entries</h3>
                    <br></br>
                    <ImEye size={50}/>
                </div>
            </Link>
            </div>
            <div className="dashbox">
            <Link to="createje">
                <div className = "card">
                    <h3>Create<br></br>Journal Entries</h3>
                    <br></br>
                    < IoIosCreate size={50}/>
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

