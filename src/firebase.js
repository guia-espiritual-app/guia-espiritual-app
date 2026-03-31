import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7rRoCD_uUWzluKjEDfHGEQ5EvbfgM8Ko",
  authDomain: "guia-espirit-app.firebaseapp.com",
  projectId: "guia-espirit-app",
  storageBucket: "guia-espirit-app.firebasestorage.app",
  messagingSenderId: "367768479274",
  appId: "1:367768479274:web:eb35852136197d97c94553"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;