// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage, ref } from 'firebase/storage'
import { Firestore, getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAprDEuUOpyd_CXTrlPjqWJPNBLYGHKi0I",
  authDomain: "mwenzi-d77c4.firebaseapp.com",
  projectId: "mwenzi-d77c4",
  storageBucket: "mwenzi-d77c4.appspot.com",
  messagingSenderId: "771753936157",
  appId: "1:771753936157:web:6b4573bf364f82461d4df4",
  databaseURL: "https://mwenzi-d77c4-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);

export const functions = getFunctions(firebase, 'asia-east1');
const firebaseStorage = getStorage(firebase);
export const storage = ref(firebaseStorage)
export const firestore = getFirestore(firebase);
export const database = getDatabase(firebase);