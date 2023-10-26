// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxb_5v_DrxZblBR0I4oaYiPACIG3iss1o",
  authDomain: "cartshop-b4113.firebaseapp.com",
  projectId: "cartshop-b4113",
  storageBucket: "cartshop-b4113.appspot.com",
  messagingSenderId: "1055984918384",
  appId: "1:1055984918384:web:0a1f80717b477dc841b9b5",
  measurementId: "G-V9NVZMQP8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}