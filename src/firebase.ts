// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyC7X-nfgrDkA1ccq4qg8ZKfg2mfRIybL8s",
    authDomain: "nexus-2bc36.firebaseapp.com",
    projectId: "nexus-2bc36",
    storageBucket: "nexus-2bc36.appspot.com",
    messagingSenderId: "549886298999",
    appId: "1:549886298999:web:99357ae503e6b362602f72",
    measurementId: "G-FNH8MG4X3Y"
};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
export const auth = getAuth();
