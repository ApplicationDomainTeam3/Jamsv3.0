import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {db} from './firestore';
import { collection, getDocs, addDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import { Register } from "./Register"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "./firebase";
import menuLogo from './img/JAMS_1563X1563.png'
import MustContainElement from "./MustContainElement";
import { Link } from "react-router-dom";


export const ViewUsers = () => {









}