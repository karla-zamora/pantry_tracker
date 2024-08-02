// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADrva_43ruXXr24pfdPEAzhicvGIFVi70",
  authDomain: "pantrytracker-f4b91.firebaseapp.com",
  projectId: "pantrytracker-f4b91",
  storageBucket: "pantrytracker-f4b91.appspot.com",
  messagingSenderId: "512149922224",
  appId: "1:512149922224:web:4e08642b01ea1c99bf3675",
  measurementId: "G-H3RR89FT30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}