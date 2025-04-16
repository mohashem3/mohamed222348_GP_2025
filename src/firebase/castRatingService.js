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
  deleteDoc,
} from 'firebase/firestore'
import { getAllCreditsByPersonId, getPersonDetailsById } from '@/services/tmdb'

// ✅ Save or update a cast member's rating
export const submitCastRating = async (
  userId,
  movieId,
  castId,
  castName,
  role,
  rating,
  personId,
) => {
  try {
    console.log('🎯 submitCastRating called with:', {
      userId,
      movieId,
      castId,
      castName,
      role,
      rating,
      personId,
    })

    const safeRole = role || 'Unknown'

    const q = query(
      collection(db, 'users', userId, 'cast_ratings'),
      where('movieId', '==', movieId),
      where('castId', '==', castId),
    )

    const existing = await getDocs(q)

    if (!existing.empty) {
      const docId = existing.docs[0].id
      await updateDoc(doc(db, 'users', userId, 'cast_ratings', docId), {
        rating,
        updatedAt: serverTimestamp(),
      })
    } else {
      await addDoc(collection(db, 'users', userId, 'cast_ratings'), {
        userId,
        movieId: Number(movieId),
        castId: Number(castId),
        castName,
        role: safeRole,
        rating,
        personId: String(personId),
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
      where('movieId', '==', Number(movieId)),
      where('castId', '==', Number(castId)),
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

// ✅ Get all ratings (all users) for a specific cast+movie
export const getAllCastRatingsForMovie = async (castId, movieId) => {
  try {
    const q = query(
      collectionGroup(db, 'cast_ratings'),
      where('castId', '==', Number(castId)),
      where('movieId', '==', Number(movieId)),
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

export const getUniqueCastMembersByRole = async (targetRole) => {
  try {
    const q = query(collectionGroup(db, 'cast_ratings'), where('role', '==', targetRole))
    const snapshot = await getDocs(q)

    const castMap = new Map()

    snapshot.forEach((doc) => {
      const data = doc.data()
      const personId = data.personId
      if (!personId || castMap.has(personId)) return

      castMap.set(personId, {
        castId: data.castId, // needed for average rating
        castName: data.castName,
        role: data.role,
        profile: '', // to be added later
        personId: personId,
      })
    })

    return Array.from(castMap.values())
  } catch (err) {
    console.error('Error fetching unique cast members:', err)
    return []
  }
}

// ✅ Get top rated cast by role, with career movie count
export const getTopRatedCastByRole = async (role) => {
  try {
    const castList = await getUniqueCastMembersByRole(role)

    const enrichedCast = await Promise.all(
      castList.map(async (cast) => {
        const q = query(collectionGroup(db, 'cast_ratings'), where('castId', '==', cast.castId))
        const snapshot = await getDocs(q)

        let totalRating = 0
        let totalReviews = 0
        const movieIds = new Set()
        let profile = ''
        if (cast.personId) {
          try {
            const personDetails = await getPersonDetailsById(cast.personId)
            profile = personDetails.profile_path
          } catch {
            console.warn('Could not fetch TMDB profile for', cast.castName)
          }
        }
        snapshot.forEach((doc) => {
          const data = doc.data()
          if (typeof data.rating === 'number') {
            totalRating += data.rating
            totalReviews += 1
            movieIds.add(data.movieId)
          }
        })

        const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0

        // ✅ Step 3: Fetch career movie count using TMDB
        let careerMovies = 0
        if (cast.personId && cast.personId !== 'undefined') {
          const credits = await getAllCreditsByPersonId(cast.personId)
          const creditsList = role === 'Director' ? credits.crew : credits.cast
          careerMovies = creditsList.length
        }

        return {
          ...cast,
          avgRating,
          totalReviews,
          movies: movieIds.size, // Ratings-based count
          careerMovies, // Total movies from TMDB
          profile,
        }
      }),
    )

    return enrichedCast
      .filter((c) => c.totalReviews > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 20)
  } catch (err) {
    console.error('Error building top rated cast list:', err)
    return []
  }
}

export const deleteCastRating = async (userId, movieId, castId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'cast_ratings'),
      where('movieId', '==', Number(movieId)),
      where('castId', '==', Number(castId)),
    )
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id
      await deleteDoc(doc(db, 'users', userId, 'cast_ratings', docId))
    }
  } catch (err) {
    console.error('Error deleting cast rating:', err)
  }
}

import { getAuth } from 'firebase/auth'

export const deleteAllCastRatingsForCurrentUser = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    alert('No user logged in.')
    return
  }

  try {
    const ratingsRef = collection(db, 'users', user.uid, 'cast_ratings')
    const snapshot = await getDocs(ratingsRef)

    const deletes = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, 'users', user.uid, 'cast_ratings', docSnap.id)),
    )

    await Promise.all(deletes)

    console.log(`✅ Deleted ${snapshot.docs.length} cast rating(s) for user: ${user.uid}`)
    alert('All your cast ratings have been permanently deleted.')
  } catch (err) {
    console.error('❌ Error deleting cast ratings:', err)
    alert('Error deleting cast ratings. See console for details.')
  }
}
