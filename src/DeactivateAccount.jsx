import {Register } from "./Register"
import {  } from 'firebase/auth'; 
import { db } from "./firestore";

export const disableUser = async (uid, startDate, endDate) => {
    try {
      // Set the start and end dates for the user's account
      await db.collection('users').doc(uid).update({ disabled: true, startDate, endDate });
    } catch (error) {
      console.log(error);
    }
  };
  

  export default disableUser