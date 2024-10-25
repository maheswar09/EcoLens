import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdiHduIdbOdvi4__H3OgInKhzpfEH4MEw",
  authDomain: "ecolens-a1c86.firebaseapp.com",
  databaseURL: "https://ecolens-a1c86-default-rtdb.firebaseio.com",
  projectId: "ecolens-a1c86",
  storageBucket: "ecolens-a1c86.appspot.com",
  messagingSenderId: "313503994431",
  appId: "1:313503994431:web:cf320492af2a83bae01e8a",
  measurementId: "G-257S36G7Y6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
