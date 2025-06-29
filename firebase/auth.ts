import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";

// signup with email and password
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// signin with email and password
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// signout
export const logout = () => {
  return signOut(auth);
};

// reset password
export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// subscribe to auth state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// get current user
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  return user ? user : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = auth.currentUser;
  return user !== null;
};

// Get user email
export const getUserEmail = (): string | null => {
  const user = auth.currentUser;
  return user ? user.email : null;
};

// Get user ID
export const getUserId = (): string | null => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

// Get user display name
export const getUserDisplayName = (): string | null => {
  const user = auth.currentUser;
  return user ? user.displayName : null;
};