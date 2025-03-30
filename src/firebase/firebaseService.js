import { doc, updateDoc } from 'firebase/firestore'
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth, db } from './firebaseConfig'

// 🔁 Update username in Firestore
export const updateUserName = async (userId, newName) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { name: newName })
}

// ✉️ Update email (requires reauthentication)
export const updateUserEmail = async (currentPassword, newEmail) => {
  const user = auth.currentUser
  const credential = EmailAuthProvider.credential(user.email, currentPassword)

  console.log('🔐 Reauthenticating for email update with:', {
    email: user.email,
    enteredPassword: currentPassword,
  })

  await reauthenticateWithCredential(user, credential)
  await updateEmail(user, newEmail)
}

// 🔒 Update password (requires reauthentication)
export const updateUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser
  const credential = EmailAuthProvider.credential(user.email, currentPassword)

  console.log('🔐 Reauthenticating for password update with:', {
    email: user.email,
    enteredPassword: currentPassword,
  })

  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}
