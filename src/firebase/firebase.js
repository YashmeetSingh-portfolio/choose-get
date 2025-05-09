
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importing Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Importing Firestore
const firebaseConfig = {
  apiKey: "AIzaSyAqzb9npWZFP1A0GPW2vQAIl-fTqixO55E",
  authDomain: "choose-and-get.firebaseapp.com",
  projectId: "choose-and-get",
  storageBucket: "choose-and-get.firebasestorage.app",
  messagingSenderId: "718795571653",
  appId: "1:718795571653:web:b5cf47862e084c73110bac",
  measurementId: "G-JYSRB1QFKM"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };