// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Firebase Authentication
import { getFirestore } from 'firebase/firestore' // Firestore Database

// Your web app's Firebase configuration
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
const db = getFirestore(app) // Initialize Firestore Database

// Export both authentication and Firestore
export { auth, db }

// // Import the functions you need from the SDKs
// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'
// import { getStorage } from 'firebase/storage' // ✅ Storage import

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyDYMkJm3fli5r_FlPV53Jk7ZDvtKQT2_Mc',
//   authDomain: 'mohamed222348-gp-2025.firebaseapp.com',
//   projectId: 'mohamed222348-gp-2025',
//   storageBucket: 'mohamed222348-gp-2025.appspot.com', // ✅ FIXED: must end in .app**spot**.com
//   messagingSenderId: '14725513218',
//   appId: '1:14725513218:web:8b7d00b92761dc1981271b',
//   measurementId: 'G-S3QBV8F8DW',
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig)

// const auth = getAuth(app)
// const db = getFirestore(app)
// const storage = getStorage(app) // ✅ Initialize Storage

// // Export everything
// export { auth, db, storage }
