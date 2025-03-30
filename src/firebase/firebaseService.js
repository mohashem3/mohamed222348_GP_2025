import { doc, updateDoc } from 'firebase/firestore'
import { updateEmail, updatePassword } from 'firebase/auth'
import { auth, db } from './firebaseConfig'

// 🔁 Update username in Firestore
export const updateUserName = async (userId, newName) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { name: newName })
}

// ✉️ Update email (requires reauthentication)
export const updateUserEmail = async (currentEmail, _, newEmail) => {
  const user = auth.currentUser
  await updateEmail(user, newEmail)
}

// 🔒 Update password (requires reauthentication)
export const updateUserPassword = async (currentEmail, _, newPassword) => {
  const user = auth.currentUser
  await updatePassword(user, newPassword)
}
