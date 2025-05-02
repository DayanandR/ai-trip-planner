// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN3HnrLKksFXGwdzWkL9VUb5mIOWluq6Q",
  authDomain: "ai-trip-planner-ed0d2.firebaseapp.com",
  projectId: "ai-trip-planner-ed0d2",
  storageBucket: "ai-trip-planner-ed0d2.firebasestorage.app",
  messagingSenderId: "384571047160",
  appId: "1:384571047160:web:31a8c477665482903e4f0d",
  measurementId: "G-WCSVZ7DV0M",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
