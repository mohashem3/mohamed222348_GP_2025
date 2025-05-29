import { db } from './firebaseConfig'
import { format } from 'date-fns'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  orderBy,
} from 'firebase/firestore'
import { getPrimaryGenre } from '@/services/tmdb'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

// ✅ SUBMIT a new review
export const submitReview = async (
  userId,
  movieId,
  reviewText,
  sentiment,
  rating,
  userName,
  confidence,
) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    const userName = userSnap.exists() ? userSnap.data().name || 'Anonymous' : 'Anonymous'

    const primaryGenreId = await getPrimaryGenre(movieId)

    const reviewRef = collection(db, 'reviews')
    await addDoc(reviewRef, {
      userId,
      movieId: String(movieId),
      reviewText,
      sentiment,
      confidence,
      rating,
      userName,
      genre_ids: [primaryGenreId], // ✅ Only 1 genre stored
      createdAt: serverTimestamp(),
      createdAtMillis: Date.now(),
    })

    console.log('✅ Review submitted successfully with genre_ids:', [primaryGenreId])
    return true
  } catch (error) {
    console.error('Error submitting review:', error)
    return false
  }
}

// ✅ GET all reviews for a specific movie (with username + formatted date)
export const getReviewsForMovie = async (movieId) => {
  try {
    const reviewsQuery = query(collection(db, 'reviews'), where('movieId', '==', String(movieId)))
    const querySnapshot = await getDocs(reviewsQuery)

    const reviews = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data()

        const createdAtRaw = data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        const createdAtFormatted = format(createdAtRaw, 'MMMM d, yyyy · h:mm a')

        const userRef = doc(db, 'users', data.userId)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.exists() ? userSnap.data() : {}
        const userName = userData.name || 'Anonymous'

        return {
          id: docSnap.id,
          ...data,
          userName,
          createdAt: createdAtRaw,
          createdAtFormatted,
        }
      }),
    )

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

// ✅ NEW: GET all reviews written by a specific user
const fetchMovieTitleFromTMDB = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    )
    const data = await response.json()
    return data.title || 'Unknown Movie'
  } catch {
    console.warn(`❌ Failed to fetch title for movieId: ${movieId}`)
    return 'Unknown Movie'
  }
}

export const getReviewsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    )
    const querySnapshot = await getDocs(q)

    const reviews = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data()
        const createdAtRaw = data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        const createdAtFormatted = format(createdAtRaw, 'MMMM d, yyyy · h:mm a')

        const movieTitle = await fetchMovieTitleFromTMDB(data.movieId)

        return {
          id: docSnap.id,
          ...data,
          createdAt: createdAtRaw,
          createdAtFormatted,
          movieTitle,
        }
      }),
    )

    return reviews
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
}

// UPDATE an existing review
export const updateReview = async (reviewId, updatedFields) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId)
    await updateDoc(reviewRef, {
      ...updatedFields,
      editedAt: serverTimestamp(),
    })
    console.log('✏️ Review updated successfully!')
    return true
  } catch (error) {
    console.error('Error updating review:', error)
    return false
  }
}

// Get sentiment stats
export const getSentimentStats = async (movieId) => {
  try {
    const reviews = await getReviewsForMovie(movieId)
    const total = reviews.length
    const positive = reviews.filter((r) => r.sentiment === 'positive').length
    return { positiveCount: positive, reviewCount: total }
  } catch (err) {
    console.error('Error getting sentiment stats:', err)
    return { positiveCount: 0, reviewCount: 0 }
  }
}

// LISTEN to real-time review updates
export const listenToReviews = (movieId, callback) => {
  const q = query(
    collection(db, 'reviews'),
    where('movieId', '==', String(movieId)),
    orderBy('createdAtMillis', 'desc'), // most recent first
  )
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data()
      const createdAtRaw = data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
      return {
        id: doc.id,
        ...data,
        createdAt: createdAtRaw,
        createdAtFormatted: format(createdAtRaw, 'MMMM d, yyyy · h:mm a'),
      }
    })
    callback(reviews)
  })
}

// DELETE a review
export const deleteReview = async (reviewId) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId)
    await deleteDoc(reviewRef)
    console.log('🗑️ Review deleted successfully!')
    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    return false
  }
}

// GET review texts only (for summarization)
export const getReviewTextsByMovie = async (movieId) => {
  try {
    const q = query(collection(db, 'reviews'), where('movieId', '==', String(movieId)))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs
      .map((doc) => doc.data().reviewText)
      .filter((text) => typeof text === 'string' && text.trim() !== '')
  } catch (error) {
    console.error('Error fetching review texts:', error)
    return []
  }
}
