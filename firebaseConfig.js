import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCKvEygEf0C2UYVauwLKLzVK8pORR9zHPE",
    authDomain: "torneo-tnc-a5cac.firebaseapp.com",
    projectId: "torneo-tnc-a5cac",
    storageBucket: "torneo-tnc-a5cac.firebasestorage.app",
    messagingSenderId: "1084428503851",
    appId: "1:1084428503851:web:56485ff2c2a1d83c78d36e",
    measurementId: "G-GPSE69GFL8"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase App inicializada:", app);
const db = getFirestore(app);

export { db };
