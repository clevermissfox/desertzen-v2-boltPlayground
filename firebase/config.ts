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
// Only connect to emulators if they are actually running
if (__DEV__ && typeof window !== 'undefined') {
  // Check if we're in a browser environment and emulators might be available
  const connectToEmulators = async () => {
    try {
      // Test if emulator is running by making a simple request
      const response = await fetch('http://localhost:9099', { 
        method: 'GET',
        mode: 'no-cors'
      });
      
      // If we get here, emulator is likely running
      if (!auth._delegate._config.emulator) {
        connectAuthEmulator(auth, "http://localhost:9099");
      }
      
      if (!db._delegate._databaseId.projectId.includes('demo-')) {
        connectFirestoreEmulator(db, "localhost", 8080);
      }
    } catch (error) {
      // Emulators are not running, use production Firebase
      console.log("Firebase emulators not detected, using production Firebase");
    }
  };
  
  connectToEmulators();
}