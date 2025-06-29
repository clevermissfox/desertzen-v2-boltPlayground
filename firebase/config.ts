// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm_PkFPyI4XLcfPXroxip6_Jb5P2ykaYg",
  authDomain: "desert-zen.firebaseapp.com",
  projectId: "desert-zen",
  storageBucket: "desert-zen.firebasestorage.app",
  messagingSenderId: "46183478558",
  appId: "1:46183478558:web:cbdee23d1a3662e910c50f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
