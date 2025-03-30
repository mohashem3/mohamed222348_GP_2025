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
  onSnapshot,
} from 'firebase/firestore'

// ✅ SUBMIT a new review
export const submitReview = async (userId, movieId, reviewText, sentiment, rating) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    const userName = userSnap.exists() ? userSnap.data().name || 'Anonymous' : 'Anonymous'

    const reviewRef = collection(db, 'reviews')
    await addDoc(reviewRef, {
      userId,
      movieId: String(movieId),
      reviewText,
      sentiment,
      rating,
      userName,
      createdAt: serverTimestamp(),
    })
    console.log('✅ Review submitted successfully!')
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

        const createdAtFormatted =
          data.timestamp && data.timestamp.toDate
            ? format(data.timestamp.toDate(), 'MMMM d, yyyy')
            : ''

        const userRef = doc(db, 'users', data.userId)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.exists() ? userSnap.data() : {}
        const userName = userData.name || 'Anonymous'

        return {
          id: docSnap.id,
          ...data,
          userName,
          createdAt: createdAtFormatted,
        }
      }),
    )

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

// ✅ Get sentiment stats
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

// 🔁 LISTEN to real-time review updates
export const listenToReviews = (movieId, callback) => {
  const q = query(collection(db, 'reviews'), where('movieId', '==', String(movieId)))
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? format(data.createdAt.toDate(), 'MMMM d, yyyy') : '',
      }
    })
    callback(reviews)
  })
}
