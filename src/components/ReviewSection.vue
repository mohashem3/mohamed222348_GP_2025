<template>
  <div class="bg-white py-12 px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">User Reviews</h2>

    <!-- Review Input -->
    <div class="bg-gray-50 p-6 rounded-xl shadow mb-12">
      <textarea
        v-model="reviewText"
        placeholder="Write your review here..."
        rows="4"
        class="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition mb-4"
      />

      <!-- Star Selector -->
      <div class="flex items-center gap-1 mb-4">
        <span class="text-sm font-semibold text-gray-700 mr-2">Your Rating:</span>
        <template v-for="n in 5" :key="n">
          <svg
            @click="selectedRating = n"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 cursor-pointer transition"
            :class="n <= selectedRating ? 'text-yellow-400' : 'text-gray-300'"
          >
            <path
              d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
            />
          </svg>
        </template>
      </div>

      <button
        class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
        @click="handleSubmitReview"
      >
        Submit Review
      </button>
    </div>

    <!-- Review List -->
    <div v-if="reviews.length" class="space-y-10">
      <div v-for="review in reviews" :key="review.id" class="border-b pb-6 flex items-start gap-4">
        <img
          :src="`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.userName || 'Anonymous')}&chars=2`"
          class="w-10 h-10 rounded-full object-cover"
          alt="User Avatar"
        />

        <div>
          <p class="font-semibold text-gray-900">{{ review.userName || 'Anonymous' }}</p>
          <p class="text-sm text-gray-500 mb-2">{{ review.createdAt }}</p>

          <!-- Star Display -->
          <div class="flex items-center gap-1 text-yellow-400 mb-2">
            <template v-for="n in 5" :key="n">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-4 h-4"
                :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                <path
                  d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
                />
              </svg>
            </template>
          </div>

          <!-- Sentiment Tag -->
          <span
            class="text-xs font-semibold px-2 py-1 rounded-full"
            :class="
              review.sentiment === 'positive'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            "
          >
            {{ review.sentiment }}
          </span>

          <p class="mt-2 text-gray-700 leading-relaxed">{{ review.reviewText }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500">No reviews yet. Be the first to share your thoughts!</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { submitReview, getReviewsForMovie } from '@/firebase/reviewService'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

const props = defineProps({
  movieId: [String, Number],
})

const reviewText = ref('')
const selectedRating = ref(0)
const reviews = ref([])

const handleSubmitReview = async () => {
  if (!reviewText.value.trim()) {
    Swal.fire('Oops!', 'Review cannot be empty.', 'warning')
    return
  }

  if (selectedRating.value === 0) {
    Swal.fire('Oops!', 'Please select a star rating.', 'warning')
    return
  }

  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    Swal.fire('Not Logged In', 'Please log in to submit a review.', 'info')
    return
  }

  try {
    // 🔥 Predict sentiment
    const response = await fetch(
      'https://sentimentmodelmohamed222348gp-production.up.railway.app/predict',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reviewText.value }),
      },
    )

    const data = await response.json()
    const sentiment = data.sentiment || 'neutral'

    // 🔥 Get user's display name from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}
    const userName = userData.name || 'Anonymous'

    // 🔥 Submit to Firestore
    await submitReview(
      user.uid,
      props.movieId,
      reviewText.value,
      sentiment,
      selectedRating.value,
      userName,
    )

    // 🔥 Build new review for instant UI update
    const newReview = {
      id: 'temp-' + Date.now(),
      userId: user.uid,
      movieId: props.movieId,
      reviewText: reviewText.value,
      sentiment,
      rating: selectedRating.value,
      userName,
      createdAt: format(new Date(), 'MMMM d, yyyy'),
    }

    reviews.value.unshift(newReview)

    Swal.fire('Thank you!', 'Your review was submitted successfully.', 'success')

    reviewText.value = ''
    selectedRating.value = 0
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Something went wrong. Try again later.', 'error')
  }
}

const loadReviews = async () => {
  try {
    reviews.value = await getReviewsForMovie(String(props.movieId))
  } catch (err) {
    console.error('Failed to load reviews:', err)
  }
}

onMounted(() => {
  loadReviews()
})
</script>
