// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqXfKCuZPIaqoncNU7gkFRFHxtJh2vwhQ",
  authDomain: "enterflow-b3321.firebaseapp.com",
  projectId: "enterflow-b3321",
  storageBucket: "enterflow-b3321.appspot.com",
  messagingSenderId: "728598941585",
  appId: "1:728598941585:web:ba40e8383e55f9e1b11430"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const auth2=getAuth(secondaryApp)

export const db=getFirestore(app)
export const storage=getStorage(app)