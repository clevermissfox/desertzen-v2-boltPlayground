// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { Platform } from "react-native";

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

// For development/testing - connect to emulators in development for all platforms
if (__DEV__) {
  // Connect to Firebase emulators for development
  // Make sure to start the emulators first: firebase emulators:start
  
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    console.log("Emulator connection error:", error);
  }
}