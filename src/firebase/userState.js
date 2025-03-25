// firebase/userState.js
import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebaseConfig'

export const currentUser = ref(null)

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      currentUser.value = {
        uid: user.uid,
        email: user.email,
        name: docSnap.data().name,
      }
    }
  } else {
    currentUser.value = null
  }
})
