// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Import authentication
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDYMkJm3fli5r_FlPV53Jk7ZDvtKQT2_Mc',
  authDomain: 'mohamed222348-gp-2025.firebaseapp.com',
  projectId: 'mohamed222348-gp-2025',
  storageBucket: 'mohamed222348-gp-2025.firebasestorage.app',
  messagingSenderId: '14725513218',
  appId: '1:14725513218:web:8b7d00b92761dc1981271b',
  measurementId: 'G-S3QBV8F8DW',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app) // Initialize Firebase Auth

export { auth }
