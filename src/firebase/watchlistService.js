// src/firebase/watchlistService.js
import { db } from './firebaseConfig'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

// ✅ Add to watchlist
export const addToWatchlist = async (userId, movieId, movieData) => {
  try {
    const ref = doc(db, 'users', userId, 'watchlist', String(movieId))
    await setDoc(ref, {
      ...movieData,
      timestamp: new Date(),
    })
    return true
  } catch (err) {
    console.error('Error adding to watchlist:', err)
    return false
  }
}

// ❌ Remove from watchlist
export const removeFromWatchlist = async (userId, movieId) => {
  try {
    const ref = doc(db, 'users', userId, 'watchlist', String(movieId))
    await deleteDoc(ref)
    return true
  } catch (err) {
    console.error('Error removing from watchlist:', err)
    return false
  }
}

// 🔍 Check if movie is in watchlist
export const isInWatchlist = async (userId, movieId) => {
  try {
    const ref = doc(db, 'users', userId, 'watchlist', String(movieId))
    const snapshot = await getDoc(ref)
    return snapshot.exists()
  } catch (err) {
    console.error('Error checking watchlist:', err)
    return false
  }
}
