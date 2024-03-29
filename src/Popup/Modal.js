import React, { useState } from "react";
import "./modal.css";
import { Link } from 'react-router-dom';
import {Eform} from "./eform";


//popup 
export function Modal() {
  console.log("the modal is rendering")
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      <button className="custom-button" onClick={toggleModal} >
        Email
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
          
               <Eform/>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}