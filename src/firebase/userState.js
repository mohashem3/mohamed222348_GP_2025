// firebase/userState.js
import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebaseConfig'

export const currentUser = ref(null)

export const loadUserProfile = async (userId) => {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const userData = docSnap.data()

    currentUser.value = {
      uid: userId,
      email: auth.currentUser.email,
      name: userData.name,
      displayName: userData.name, // 👈 add this line
    }
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadUserProfile(user.uid)
  } else {
    currentUser.value = null
  }
})
