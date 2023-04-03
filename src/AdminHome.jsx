import { IoIosCreate } from 'react-icons/io';
import { ImPlus } from 'react-icons/im';
import { ImEye } from 'react-icons/im';
import { ImWarning } from 'react-icons/im';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export const AdminHome = (props) => {

    return (
        <>
            <Link to="addaccount">
                <div className = "card">
                    <h3>Add<br></br> Account</h3>
                    <br></br>
                    <ImPlus size={50}/>
                </div>
            </Link>
            <Link to="viewaccounts">
                <div className = "card">
                    <h3>View<br></br> Accounts</h3>
                    <br></br>
                    <ImEye size={50}/>
                </div>
            </Link>
            <Link to="viewusers">
                <div className = "card">
                    <h3>View</h3>
                    
                    <h3>Users</h3>
                    <br></br>
                    <AccountCircleIcon sx={{ fontSize: 50 }}/>
                </div>
            </Link>
            <Link to="adminCreateUser">
                <div className = "card">
                    <h3>Create<br></br> User</h3>
                    <br></br>
                    <ImPlus size={50}/>
                </div>
            </Link>
        </>
        
        );
}

