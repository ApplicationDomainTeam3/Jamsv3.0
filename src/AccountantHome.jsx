import { IoIosCreate } from 'react-icons/io';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { ImEye } from 'react-icons/im';
import { ImWarning } from 'react-icons/im';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BiAddToQueue} from 'react-icons/bi';



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
            <Link to="createje">
                <div className = "card">
                    <h3>Create<br></br>Journal Entries</h3>
                    <br></br>
                    < IoIosCreate size={50}/>
                </div>
            </Link>
        </div>
        </div>
          
         
        
        </>
        
        );
}

