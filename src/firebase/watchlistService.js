// src/firebase/watchlistService.js
import { db } from './firebaseConfig'
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'

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

// 📄 Get user's full watchlist
export const getUserWatchlist = async (userId) => {
  try {
    const q = query(collection(db, 'users', userId, 'watchlist'), orderBy('timestamp', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (err) {
    console.error('Error fetching user watchlist:', err)
    return []
  }
}

// 🧹 Clear entire watchlist
export const clearWatchlist = async (userId) => {
  try {
    const ref = collection(db, 'users', userId, 'watchlist')
    const snapshot = await getDocs(ref)
    const batchDeletes = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref))
    await Promise.all(batchDeletes)
    return true
  } catch (err) {
    console.error('Error clearing watchlist:', err)
    return false
  }
}

// 📊 Get most frequent genres in watchlist (based on primaryGenre)
export const getTopGenresFromWatchlist = async (userId, topN = 3) => {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'watchlist'))
    const genreCount = {}

    snapshot.forEach((doc) => {
      const data = doc.data()
      const genre = data.primaryGenre
      if (genre) {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      }
    })

    // Sort genres by frequency
    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([genre]) => genre)

    return sortedGenres
  } catch (err) {
    console.error('Error analyzing watchlist genres:', err)
    return []
  }
}
