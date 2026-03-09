import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
    apiKey: "AIzaSyBUnjaCiJDbx0Dat1GE20Ytcz-CsFJDV_g",
    authDomain: "emergisync.firebaseapp.com",
    projectId: "emergisync",
    storageBucket: "emergisync.firebasestorage.app",
    messagingSenderId: "914078246074",
    appId: "1:914078246074:web:6c6a9bba3f411533c98e83",
    measurementId: "G-8081T8DR8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore references
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
