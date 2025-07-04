import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    getDoc,
    setDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Your Firebase config from environment variables
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// ✅ Initialize the Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// ✅ Initialize Firebase Auth with AsyncStorage persistence
let auth
try {
    auth = getAuth(app)
} catch (error) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    })
}

const db = getFirestore(app)

export {
    app,
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    getDoc,
    setDoc,
}
