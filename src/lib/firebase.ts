// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

// TODO: Add your own Firebase configuration object here
const firebaseConfig = {
  "projectId": "krishiconnectsih-7026321-d7724",
  "appId": "1:304978622970:web:ddfd5c06b014a4a0e64c43",
  "apiKey": "AIzaSyD_CjMM3W5zIAnCxXlrvu42cYV1LOpqeSM",
  "authDomain": "krishiconnectsih-7026321-d7724.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "304978622970"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth, onAuthStateChanged, type User };
