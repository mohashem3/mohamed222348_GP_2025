<template>
  <div class="bg-white py-12 px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">
      User Reviews
      <span class="text-pink-600 text-xl font-semibold">({{ reviews.length }})</span>
    </h2>

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
        class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        @click="handleSubmitReview"
        :disabled="isSubmitting"
      >
        <svg
          v-if="isSubmitting"
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span>{{ isSubmitting ? 'Submitting...' : 'Submit Review' }}</span>
      </button>
    </div>
    <!-- Filter Dropdown -->
    <div class="flex justify-end mb-6">
      <select
        v-model="filterOption"
        class="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="newest">Sort by Newest</option>
        <option value="oldest">Sort by Oldest</option>
        <option value="positive">Positive Reviews</option>
        <option value="negative">Negative Reviews</option>
        <option value="mine">My Reviews</option>
      </select>
    </div>

    <!-- Review List -->
    <div v-if="reviews.length" class="space-y-10">
      <div
        v-for="review in paginatedReviews"
        :key="review.id"
        class="border-b pb-6 flex items-start gap-4"
      >
        <!-- Avatar -->
        <img
          :src="`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            review.userName || 'Anonymous',
          )}&chars=2`"
          class="w-10 h-10 rounded-full object-cover"
          alt="User Avatar"
        />

        <div class="flex-1">
          <!-- Header Row -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-900">{{ review.userName || 'Anonymous' }}</p>
              <p class="text-sm text-gray-500 mb-2">{{ review.createdAtFormatted }}</p>
            </div>

            <!-- Sentiment Badge -->
            <!-- Sentiment Badge with Tooltip & Animation -->
            <span
              class="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase transition-transform"
              :class="[
                review.sentiment === 'positive'
                  ? 'bg-green-100 text-green-800 pulse-glow-positive'
                  : 'bg-red-100 text-red-800 pulse-glow-negative',
              ]"
              :title="`This is how our AI interpreted the review sentiment with ${review.confidence || 100}% confidence.`"
            >
              ({{ review.confidence || 100 }}%) {{ review.sentiment }}
            </span>
          </div>

          <!-- Edit Mode -->
          <div v-if="editingReviewId === review.id">
            <textarea
              v-model="editedText"
              rows="3"
              class="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition mb-3"
            />

            <div class="flex items-center gap-1 mb-3">
              <span class="text-sm font-semibold text-gray-700 mr-2">Edit Rating:</span>
              <template v-for="n in 5" :key="n">
                <svg
                  @click="editedRating = n"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 cursor-pointer"
                  :class="n <= editedRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  <path
                    d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
                  />
                </svg>
              </template>
            </div>

            <div class="flex gap-3">
              <button
                @click="saveEdit(review)"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Normal View -->
          <div v-else>
            <!-- Star Rating -->
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

            <!-- Review Text and Action Icons -->
            <div class="flex justify-between items-start">
              <p class="text-gray-700 leading-relaxed max-w-[90%]">{{ review.reviewText }}</p>

              <div v-if="currentUserId === review.userId" class="flex gap-4 ml-4 mt-1">
                <!-- ✏️ Edit Icon -->
                <button @click="handleEdit(review)" title="Edit">
                  <svg
                    class="w-6 h-6 text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M2 15.5A1.5 1.5 0 013.5 14H15a.5.5 0 010 1H3.5a.5.5 0 00-.5.5v.5a.5.5 0 001 0v-.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <!-- 🗑️ Delete Icon -->
                <button @click="handleDelete(review.id)" title="Delete">
                  <svg
                    class="w-6 h-6 text-gray-800 hover:text-black hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v11a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 4a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 018 6zm4 0a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8a.5.5 0 01.5-.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">No reviews yet. Be the first to share your thoughts!</div>
  </div>
  <!-- Pagination Controls -->
  <div class="mt-10 mb-20 flex justify-center items-center gap-4">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <span class="text-sm text-gray-600"> Page {{ currentPage }} of {{ totalPages }} </span>

    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { submitReview, updateReview, listenToReviews, deleteReview } from '@/firebase/reviewService'
import Swal from 'sweetalert2'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
const SENTIMENT_API = import.meta.env.VITE_SENTIMENT_API

const props = defineProps({
  movieId: [String, Number],
})
const filterOption = ref('newest') // default

const reviewText = ref('')
const selectedRating = ref(0)
const reviews = ref([])

const editingReviewId = ref(null)
const editedText = ref('')
const editedRating = ref(0)
const isSubmitting = ref(false)

let unsubscribe = null

const reviewsPerPage = 5
const currentPage = ref(1)

const filteredReviews = computed(() => {
  let result = [...reviews.value]

  switch (filterOption.value) {
    case 'positive':
      result = result.filter((r) => r.sentiment === 'positive')
      break
    case 'negative':
      result = result.filter((r) => r.sentiment === 'negative')
      break
    case 'oldest':
      result = result.sort((a, b) => a.createdAt - b.createdAt)
      break
    case 'mine':
      result = result.filter((r) => r.userId === currentUserId.value)
      break
    case 'newest':
    default:
      result = result.sort((a, b) => b.createdAt - a.createdAt)
      break
  }

  return result
})

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * reviewsPerPage
  return filteredReviews.value.slice(start, start + reviewsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredReviews.value.length / reviewsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

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
    isSubmitting.value = true

    const response = await fetch(SENTIMENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: reviewText.value }),
    })

    const { sentiment = 'neutral', confidence = 0 } = await response.json()

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}
    const userName = userData.name || 'Anonymous'

    await submitReview(
      user.uid,
      props.movieId,
      reviewText.value,
      sentiment,
      selectedRating.value,
      userName,
      confidence,
    )

    Swal.fire({
      title: '🎉 Review Sent!',
      html: `
        <p>Your review was submitted successfully.</p>

        <p style="margin-top: 20px; font-weight: 600; font-size: 1rem; color: #4b5563;">
          Review Sentiment:
        </p>

        <div style="
          display: inline-block;
          padding: 12px 24px;
          margin-top: 10px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.5rem;
          text-transform: uppercase;
          box-shadow: 0 0 18px ${sentiment === 'positive' ? '#4ade80' : '#f87171'};
          background-color: ${sentiment === 'positive' ? '#dcfce7' : '#fee2e2'};
          color: ${sentiment === 'positive' ? '#166534' : '#7f1d1d'};
        ">
          ${sentiment} (${confidence}%)
        </div>

        <p style="margin-top: 10px; font-size: 0.85rem; color: #6b7280;">
          (AI analysis of your review's tone)
        </p>
      `,
      icon: 'success',
      confirmButtonColor: '#6366f1',
    })
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Something went wrong. Try again later.', 'error')
  } finally {
    isSubmitting.value = false
    reviewText.value = ''
    selectedRating.value = 0
  }
}

const handleEdit = (review) => {
  editingReviewId.value = review.id
  editedText.value = review.reviewText
  editedRating.value = review.rating
}

const cancelEdit = () => {
  editingReviewId.value = null
  editedText.value = ''
  editedRating.value = 0
}

const saveEdit = async (review) => {
  try {
    if (!editedText.value.trim()) {
      Swal.fire('Oops!', 'Review cannot be empty.', 'warning')
      return
    }

    if (editedRating.value === 0) {
      Swal.fire('Oops!', 'Please select a rating.', 'warning')
      return
    }

    const response = await fetch(SENTIMENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editedText.value }),
    })

    const { sentiment = 'neutral', confidence = 0 } = await response.json()

    await updateReview(review.id, {
      reviewText: editedText.value,
      sentiment,
      rating: editedRating.value,
      confidence,
    })

    Swal.fire({
      title: '🎉 Review Updated!',
      html: `
        <p>Your review was updated successfully.</p>

        <p style="margin-top: 20px; font-weight: 600; font-size: 1rem; color: #4b5563;">
          Updated Sentiment:
        </p>

        <div style="
          display: inline-block;
          padding: 12px 24px;
          margin-top: 10px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.5rem;
          text-transform: uppercase;
          box-shadow: 0 0 18px ${sentiment === 'positive' ? '#4ade80' : '#f87171'};
          background-color: ${sentiment === 'positive' ? '#dcfce7' : '#fee2e2'};
          color: ${sentiment === 'positive' ? '#166534' : '#7f1d1d'};
        ">
          ${sentiment} (${confidence}%)
        </div>

        <p style="margin-top: 10px; font-size: 0.85rem; color: #6b7280;">
          (AI analysis of your updated review)
        </p>
      `,
      icon: 'success',
      confirmButtonColor: '#6366f1',
    })
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'Failed to update review.', 'error')
  }
}

const handleDelete = async (reviewId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This review will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    const success = await deleteReview(reviewId)
    if (success) {
      Swal.fire('Deleted!', 'Your review has been deleted.', 'success')
    } else {
      Swal.fire('Error', 'Failed to delete review.', 'error')
    }
  }
}

watch(filterOption, () => {
  currentPage.value = 1
})

const currentUserId = ref(null)

onMounted(() => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    currentUserId.value = user.uid
  }

  unsubscribe = listenToReviews(props.movieId, (liveReviews) => {
    reviews.value = [...liveReviews].sort((a, b) => b.createdAt - a.createdAt)
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
@keyframes pulseGlowPositive {
  0% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(0, 255, 128, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 28px rgba(0, 255, 128, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(0, 255, 128, 0.4);
  }
}

@keyframes pulseGlowNegative {
  0% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(255, 80, 80, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 28px rgba(255, 80, 80, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(255, 80, 80, 0.4);
  }
}

.pulse-glow-positive {
  animation: pulseGlowPositive 1.8s infinite ease-in-out;
}

.pulse-glow-negative {
  animation: pulseGlowNegative 1.8s infinite ease-in-out;
}
</style>
