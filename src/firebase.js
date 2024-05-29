// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import firebase from "firebase/compat/app";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get and export the DB
export const db = getFirestore(app);

export default firebase;