import { createBrowserRouter, createRoutesFromElements, Route, Link, Outlet, RouterProvider } from 'react-router-dom';
import { createRoot } from "react-dom/client";
import './App.css';
import './NavbarStyles.css'
import { Login } from './Login';
import { Register } from './Register';
import {Navbar} from './Navbar';
import {Root} from './root';
import { Forgotpass } from './Forgotpass';
import {AdminHome} from './AdminHome';
import ProtectedRoutes from './ProtectedRoutes';
import {AddAccount} from './AddAccount'
import {EditAccount} from './EditAccount'
import {ViewAccounts} from './ViewAccounts'
import {disableUser} from './DeactivateAccount'
import { AdminCreateUser } from './AdminCreateUser';
import { ViewUsers } from './ViewUsers';
import React, { useEffect, useState } from 'react';






function App() {


  //Create routes for screen navigation
const router = createBrowserRouter([
  {
    
    element: <AppLayout />,
    children: [
      {
    path: "Register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "forgotpass",
    element: <Forgotpass />
  },
  {
    path: "adminhome",
    element: <AdminHome />
  },
  {
    path: "adminhome/addaccount",
    element: <AddAccount />
  },
  {
    path: "adminhome/viewaccounts/editaccount",
    element: <EditAccount />
  },
  {
    path: "adminhome/viewaccounts",
    element: <ViewAccounts />
  },
  {
    path: "adminhome/AdminCreateUser",
    element: <AdminCreateUser/>
  },

  {
    path: "adminhome/Deactivateaccount",
    element: <disableUser/>
  },

  {
    path: "adminhome/ViewUsers",
    element: <ViewUsers/>
  },

  

  
    ]
  },
 
  
  
]);

///////////////////////////Login handler////////////////////////////////////////
const [failedAttempts, setFailedAttempts] = useState(0);
  const [currentForm, setCurrentForm] = useState('login');
  const [passwordHistory, setPasswordHistory] = useState([]);

  function handleLogin(event) {
    event.preventDefault();
    const password = event.target.password.value;
    if (password === "correctPassword") {
      // Login successful
    } else {
      // Login failed
      setFailedAttempts(failedAttempts + 1);
      if (failedAttempts === 2) {
        alert("Your account has been suspended.");
        event.target.password.disabled = true;
      }
    }
  }

  //////////////////Password Reset///////////////////////////////////////
  function handleResetPassword(event) {
    event.preventDefault();
    const newPassword = event.target.newPassword.value;
    if (passwordHistory.includes(newPassword)) {
      alert("You cannot use an old password.");
    } else {
      setPasswordHistory([...passwordHistory, newPassword]);
      alert("Password changed successfully.");
    }
  }

  /////////////////////////Routing///////////////////////////////////
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
  return (
      
      <div className="App">
       <RouterProvider router={router} />
      </div>

  );
}
const AppLayout= () => {
  return (
    <>
      <div className="App">
      <Navbar />
      <Outlet />
      </div>
      
    </>
  )
}

export default App;
