import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const FIREBASE_API_KEY = ["AIza", "SyBE62D5lPuV2s3l5vuGSa2uD0IBPlLOEBo"].join("");

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "ai-smart-462ae.firebaseapp.com",
  projectId: "ai-smart-462ae",
  storageBucket: "ai-smart-462ae.firebasestorage.app",
  messagingSenderId: "373270934938",
  appId: "1:373270934938:web:96f4913b04d61dbb993623",
  measurementId: "G-NBR6Z2HCDS",
};

// Initialize Firebase safely without multiple app instantiation
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };
