import { initializeApp } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { Capacitor } from '@capacitor/core'

const firebaseConfig = {
  apiKey: 'AIzaSyC7rRoCD_uUWzluKjEDfHGEQ5EvbfgM8Ko',
  authDomain: 'guia-espirit-app.firebaseapp.com',
  projectId: 'guia-espirit-app',
  storageBucket: 'guia-espirit-app.firebasestorage.app',
  messagingSenderId: '367768479274',
  appId: '1:367768479274:web:eb35852136197d97c94553',
}

const app = initializeApp(firebaseConfig)

// En WebView nativo, getAuth() precarga gapi/iframes de Google OAuth y rompe iOS.
// initializeAuth sin popup/redirect evita cargar gapi al arranque.
export const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app)

// Solo disponible en web; signInWithPopup no funciona en WKWebView nativo.
export const googleProvider = Capacitor.isNativePlatform() ? null : new GoogleAuthProvider()

export const db = getFirestore(app)

export default app
