import { db } from './firebaseConfig'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'

// Function to submit a review
export const submitReview = async (userId, movieId, reviewText, sentiment) => {
  try {
    const reviewRef = collection(db, 'reviews') // Reference to "reviews" collection

    await addDoc(reviewRef, {
      userId,
      movieId,
      reviewText,
      sentiment,
      timestamp: serverTimestamp(), // Firestore timestamp
    })

    console.log('Review submitted successfully!')
    return true
  } catch (error) {
    console.error('Error submitting review:', error)
    return false
  }
}

// Function to fetch reviews for a specific movie
export const getReviewsForMovie = async (movieId) => {
  try {
    const reviewsQuery = query(collection(db, 'reviews'), where('movieId', '==', movieId))
    const querySnapshot = await getDocs(reviewsQuery)

    let reviews = []
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() })
    })

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}
