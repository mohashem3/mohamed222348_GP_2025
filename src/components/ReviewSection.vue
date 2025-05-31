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
        <option value="neutral">Neutral Reviews</option>
        <option value="mine">My Reviews</option>
      </select>
    </div>

    <!-- REVIEW SUMMARY SECTION -->
    <div class="my-10 p-6 rounded-2xl bg-white border border-gray-200 shadow-md">
      <!-- BUTTON & BADGE (shown before summary) -->
      <div
        v-if="!summary && !isSummarizing"
        class="flex flex-col items-center gap-3 bg-gradient-to-br from-white via-purple-50 to-white p-10 rounded-2xl shadow-inner border border-purple-100"
      >
        <!-- Button -->
        <button
          @click="summarizeReviews"
          class="w-64 py-3 text-base font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-xl pulse-glow-purple transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:brightness-110 hover:saturate-150"
        >
          Analyze Reviews
        </button>

        <!-- Badge -->
        <span
          class="text-[11px] font-bold tracking-wide text-white bg-gradient-to-r from-purple-800 via-indigo-700 to-indigo-600 px-4 py-[5px] rounded-full shadow-sm uppercase mt-1"
        >
          AI-Powered Review Analyzer
        </span>
      </div>

      <!-- LOADING SPINNER -->
      <div v-if="isSummarizing" class="flex justify-center items-center py-12">
        <svg
          class="animate-spin h-8 w-8 text-indigo-600"
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
          ></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>

      <!-- SUMMARY CONTENT -->
      <div v-if="summary && !isSummarizing">
        <!-- Compact Header -->
        <div
          class="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-base font-semibold rounded-full shadow-md mb-6"
        >
          AI-Powered Analysis of User Reviews
        </div>

        <!-- Glowing Summary Box -->
        <div
          class="bg-white p-6 rounded-xl border border-purple-400 shadow-[0_0_60px_rgba(168,85,247,0.4)] ring-4 ring-purple-100 mb-10"
        >
          <p class="text-gray-800 text-sm leading-relaxed font-medium whitespace-pre-wrap">
            {{ summary }}
          </p>
        </div>

        <!-- Positive Points -->
        <div v-if="positives.length" class="mb-6">
          <div
            class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-green-700 shadow-[0_0_20px_rgba(74,222,128,0.4)] border border-gray-200 mb-3"
          >
            Positive Points
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(item, i) in positives"
              :key="'pos-' + i"
              class="bg-green-50 border border-green-300 text-green-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <!-- Negative Points -->
        <div v-if="negatives.length">
          <div
            class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-red-700 shadow-[0_0_20px_rgba(248,113,113,0.4)] border border-gray-200 mb-3"
          >
            Negative Points
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(item, i) in negatives"
              :key="'neg-' + i"
              class="bg-red-50 border border-red-300 text-red-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
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
              class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase transition-transform"
              :class="[
                review.sentiment === 'positive'
                  ? 'bg-green-100 text-green-800 pulse-glow-positive'
                  : review.sentiment === 'negative'
                    ? 'bg-red-100 text-red-800 pulse-glow-negative'
                    : 'bg-yellow-100 text-yellow-800 pulse-glow-mixed',
              ]"
              :style="{ minWidth: '140px', display: 'inline-flex' }"
              :title="`Our AI is ${review.confidence || 100}% confident that your review is ${review.sentiment.toUpperCase().toLowerCase()}.`"
            >
              <!-- Sentiment -->
              <span class="font-bold tracking-tight">{{ review.sentiment.toUpperCase() }}</span>

              <!-- Confidence badge -->
              <span
                class="text-white text-[11px] font-bold px-2 py-[2px] rounded-full shadow"
                :class="[
                  review.sentiment === 'positive'
                    ? 'bg-green-600'
                    : review.sentiment === 'negative'
                      ? 'bg-red-600'
                      : 'bg-yellow-500',
                ]"
              >
                {{ review.confidence || 100 }}%
              </span>
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
import {
  submitReview,
  updateReview,
  listenToReviews,
  deleteReview,
  getReviewTextsByMovie,
} from '@/firebase/reviewService'
import Swal from 'sweetalert2'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
const SENTIMENT_API = `${import.meta.env.VITE_API_URL}/predict`
//const SUMMARIZE_API = `${import.meta.env.VITE_API_URL}/summarize`
const props = defineProps({
  movieId: [String, Number],
})

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

const fetchPrimaryGenre = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    )
    const data = await response.json()
    return Array.isArray(data.genres) && data.genres.length > 0 ? data.genres[0].id : null
  } catch (err) {
    console.error('Failed to fetch genre:', err)
    return null
  }
}

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

const isSummarizing = ref(false)

const summary = ref('')
const tone = ref('')
const positives = ref([])
const negatives = ref([])

const summarizeReviews = async () => {
  isSummarizing.value = true
  summary.value = ''
  tone.value = ''
  positives.value = []
  negatives.value = []

  try {
    const reviewTexts = await getReviewTextsByMovie(props.movieId)

    if (reviewTexts.length === 0) {
      Swal.fire('No Reviews', 'There are no reviews to summarize.', 'info')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: reviewTexts }),
    })

    const data = await response.json()
    summary.value = data.summary
    tone.value = data.tone
    positives.value = data.positives
    negatives.value = data.negatives
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Failed to summarize reviews.', 'error')
  } finally {
    isSummarizing.value = false
  }
}

const filteredReviews = computed(() => {
  let result = [...reviews.value]

  switch (filterOption.value) {
    case 'positive':
      result = result.filter((r) => r.sentiment === 'positive')
      break
    case 'negative':
      result = result.filter((r) => r.sentiment === 'negative')
      break
    case 'neutral':
      result = result.filter((r) => r.sentiment === 'neutral')
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

    let { sentiment = 'neutral', confidence = 0 } = await response.json()
    confidence = Math.round(confidence) // Round for readability

    // Inject "neutral" sentiment if confidence is low
    if (confidence >= 45 && confidence <= 55) {
      sentiment = 'neutral'
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}
    const userName = userData.name || 'Anonymous'
    const primaryGenreId = await fetchPrimaryGenre(props.movieId)

    await submitReview(
      user.uid,
      props.movieId,
      reviewText.value,
      sentiment,
      selectedRating.value,
      userName,
      confidence,
      primaryGenreId,
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
      box-shadow: 0 0 18px ${
        sentiment === 'positive' ? '#4ade80' : sentiment === 'negative' ? '#f87171' : '#facc15'
      };
      background-color: ${
        sentiment === 'positive' ? '#dcfce7' : sentiment === 'negative' ? '#fee2e2' : '#fef9c3'
      };
      color: ${
        sentiment === 'positive' ? '#166534' : sentiment === 'negative' ? '#7f1d1d' : '#92400e'
      };
    ">
      ${sentiment.toUpperCase()} (${confidence}%)
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

    let { sentiment = 'neutral', confidence = 0 } = await response.json()
    confidence = Math.round(confidence)

    if (confidence >= 45 && confidence <= 55) {
      sentiment = 'mixed'
    }

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
      box-shadow: 0 0 18px ${
        sentiment === 'positive' ? '#4ade80' : sentiment === 'negative' ? '#f87171' : '#facc15'
      };
      background-color: ${
        sentiment === 'positive' ? '#dcfce7' : sentiment === 'negative' ? '#fee2e2' : '#fef9c3'
      };
      color: ${
        sentiment === 'positive' ? '#166534' : sentiment === 'negative' ? '#7f1d1d' : '#92400e'
      };
    ">
      ${sentiment.toUpperCase()} (${confidence}%)
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

@keyframes pulseGlowMixed {
  0% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(255, 230, 0, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 28px rgba(255, 230, 0, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(255, 230, 0, 0.4);
  }
}

@keyframes pulseGlowPurple {
  0% {
    transform: scale(1);
    box-shadow: 0 0 18px rgba(139, 92, 246, 0.45);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 36px rgba(139, 92, 246, 0.55);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 18px rgba(139, 92, 246, 0.45);
  }
}

.pulse-glow-purple {
  animation: pulseGlowPurple 1.8s ease-in-out infinite;
}

.pulse-glow-mixed {
  animation: pulseGlowMixed 1.8s infinite ease-in-out;
}

.pulse-glow-positive {
  animation: pulseGlowPositive 1.8s infinite ease-in-out;
}

.pulse-glow-negative {
  animation: pulseGlowNegative 1.8s infinite ease-in-out;
}
</style>
