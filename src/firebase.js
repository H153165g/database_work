// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUk2Fv_JjUum3D9oWm8NDkPF5deXjgDa0",
  authDomain: "family-money-12ed3.firebaseapp.com",
  projectId: "family-money-12ed3",
  storageBucket: "family-money-12ed3.firebasestorage.app",
  messagingSenderId: "111703925445",
  appId: "1:111703925445:web:9b6985f0e0ed22869506ac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };
