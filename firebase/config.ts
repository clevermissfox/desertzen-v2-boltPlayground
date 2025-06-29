import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Connect to emulators in development (commented out to avoid connection errors)
// if (__DEV__ && typeof window !== 'undefined') {
//   // Connect to Auth emulator
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   
//   // Connect to Firestore emulator
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;