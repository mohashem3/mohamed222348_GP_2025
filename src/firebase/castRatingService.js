// firebase/castRatingService.js
import { db } from './firebaseConfig'
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  collectionGroup,
} from 'firebase/firestore'

// ✅ Save or update a cast member's rating
export const submitCastRating = async (userId, movieId, castId, castName, role, rating) => {
  try {
    // Fallback for undefined role
    const safeRole = role || 'Unknown'

    const q = query(
      collection(db, 'users', userId, 'cast_ratings'),
      where('movieId', '==', String(movieId)),
      where('castId', '==', String(castId)),
    )

    const existing = await getDocs(q)

    if (!existing.empty) {
      // If rating exists, update it
      const docId = existing.docs[0].id
      await updateDoc(doc(db, 'users', userId, 'cast_ratings', docId), {
        rating,
        updatedAt: serverTimestamp(),
      })
    } else {
      // Else add a new rating
      await addDoc(collection(db, 'users', userId, 'cast_ratings'), {
        userId,
        movieId: String(movieId),
        castId: String(castId),
        castName,
        role: safeRole,
        rating,
        createdAt: serverTimestamp(),
      })
    }

    return true
  } catch (err) {
    console.error('Error rating cast member:', err)
    return false
  }
}

// ✅ Get all ratings for a specific cast member
export const getCastRating = async (userId, movieId, castId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'cast_ratings'),
      where('movieId', '==', String(movieId)),
      where('castId', '==', String(castId)),
    )
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      return snapshot.docs[0].data().rating
    } else {
      return null
    }
  } catch (err) {
    console.error('Error fetching cast ratings:', err)
    return null
  }
}

// ✅ NEW: Get all ratings (all users) for a specific cast+movie
export const getAllCastRatingsForMovie = async (castId, movieId) => {
  try {
    const q = query(
      collectionGroup(db, 'cast_ratings'),
      where('castId', '==', String(castId)),
      where('movieId', '==', String(movieId)),
    )

    const snapshot = await getDocs(q)
    const ratings = snapshot.docs
      .map((doc) => doc.data().rating)
      .filter((r) => typeof r === 'number')
    return ratings
  } catch (err) {
    console.error('Error fetching average cast ratings:', err)
    return []
  }
}

// ✅ Step 1: Get unique cast members by role (Actor/Director)
export const getUniqueCastMembersByRole = async (targetRole) => {
  try {
    const q = query(collectionGroup(db, 'cast_ratings'), where('role', '==', targetRole))

    const snapshot = await getDocs(q)

    const castMap = new Map()

    snapshot.forEach((doc) => {
      const data = doc.data()
      const castId = data.castId
      if (!castMap.has(castId)) {
        castMap.set(castId, {
          castId: data.castId,
          castName: data.castName,
          role: data.role,
          profile: '', // We'll update this later
        })
      }
    })

    return Array.from(castMap.values())
  } catch (err) {
    console.error('Error fetching unique cast members:', err)
    return []
  }
}
