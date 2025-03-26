import { db } from './firebaseConfig'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'

// Submit a review
export const submitReview = async (userId, movieId, reviewText, sentiment) => {
  try {
    const reviewRef = collection(db, 'reviews')
    await addDoc(reviewRef, {
      userId,
      movieId,
      reviewText,
      sentiment,
      timestamp: serverTimestamp(),
    })
    console.log('Review submitted successfully!')
    return true
  } catch (error) {
    console.error('Error submitting review:', error)
    return false
  }
}

// Get all reviews for a specific movie
export const getReviewsForMovie = async (movieId) => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('movieId', '==', String(movieId)), // force to string to match Firestore
    )

    const querySnapshot = await getDocs(reviewsQuery)

    const reviews = []
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() })
    })

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

// ✅ NEW: Get sentiment summary for a movie
export const getSentimentSummary = async (movieId) => {
  try {
    const reviewsQuery = query(collection(db, 'reviews'), where('movieId', '==', movieId))
    const querySnapshot = await getDocs(reviewsQuery)

    let total = 0
    let positive = 0
    let negative = 0

    querySnapshot.forEach((doc) => {
      const sentiment = doc.data().sentiment
      if (sentiment === 'positive') positive++
      else if (sentiment === 'negative') negative++
      total++
    })

    if (total === 0) return { type: 'none' }

    if (positive === negative) {
      return { type: 'neutral', percentage: 50 }
    }

    const isPositive = positive > negative
    const percentage = Math.round(((isPositive ? positive : negative) / total) * 100)

    return {
      type: isPositive ? 'positive' : 'negative',
      percentage,
    }
  } catch (error) {
    console.error('Error getting sentiment summary:', error)
    return { type: 'error' }
  }
}

// ✅ NEW: Get positive sentiment percentage for a movie
// ✅ Get positive + total count
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
