<template>
  <div>
    <!-- Filter and Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Your Reviews ({{ filteredReviews.length }})</h2>

      <select
        v-model="filterOption"
        class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="newest">Sort by Newest</option>
        <option value="oldest">Sort by Oldest</option>
        <option value="positive">Show Positive Reviews</option>
        <option value="negative">Show Negative Reviews</option>
        <option value="neutral">Show Neutral Reviews</option>
      </select>
    </div>

    <!-- Reviews List -->
    <div v-if="paginatedReviews.length">
      <div v-for="review in paginatedReviews" :key="review.id" class="border-b pb-6 mb-6">
        <div class="flex justify-between items-center mb-1">
          <div
            @click="goToMovie(review.movieId, review.movieTitle)"
            class="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition"
          >
            {{ review.movieTitle }}
          </div>
          <div
            class="inline-flex items-center space-x-2 bg-opacity-40 px-3 py-1 rounded-full text-sm uppercase tracking-wide transition-shadow duration-300 ease-in-out"
            :class="sentimentClass(review.sentiment)"
            :title="`Our AI detected this review as ${review.sentiment.toUpperCase()} with ${review.confidence || 100}% confidence.`"
          >
            <span class="font-extrabold">{{ review.sentiment.toUpperCase() }}</span>
            <span
              v-if="review.confidence !== undefined && review.confidence !== null"
              class="text-white text-xs bg-opacity-70 px-2 py-0.5 rounded-full font-semibold"
              :class="confidenceBadgeColor(review.sentiment)"
            >
              {{ review.confidence }}%
            </span>
          </div>
        </div>

        <p class="text-gray-500 text-sm mb-1">{{ review.createdAtFormatted }}</p>

        <!-- Stars -->
        <div class="flex items-center gap-1 text-yellow-400 mb-1">
          <template v-for="n in 5" :key="n">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
              :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              <path
                d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077
                4.665 24 6 15.281 0 9.423l8.332-1.268z"
              />
            </svg>
          </template>
        </div>

        <p class="text-gray-700 leading-relaxed">{{ review.reviewText }}</p>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6 space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border text-sm font-medium"
        >
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 rounded text-sm font-medium',
            page === currentPage ? 'bg-indigo-500 text-white' : 'border',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border text-sm font-medium"
        >
          Next
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">You haven’t written any reviews yet.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser } from '@/firebase/userState'
import { getReviewsByUser } from '@/firebase/reviewService'

const router = useRouter()

const allUserReviews = ref([])
const currentPage = ref(1)
const reviewsPerPage = 5
const filterOption = ref('newest')

const goToMovie = (movieId, title) => {
  router.push({ name: 'MovieDetails', params: { id: movieId }, query: { title } })
}

const confidenceBadgeColor = (sentiment) => {
  return {
    positive: 'bg-green-600',
    negative: 'bg-red-600',
    neutral: 'bg-yellow-500',
  }[sentiment]
}

const sentimentClass = (sentiment) => {
  return {
    positive: 'bg-green-100 text-green-800 shadow-[0_0_15px_4px_rgba(74,222,128,0.5)]',
    negative: 'bg-red-100 text-red-800 shadow-[0_0_15px_4px_rgba(248,113,113,0.5)]',
    neutral: 'bg-yellow-100 text-yellow-800 shadow-[0_0_15px_4px_rgba(234,179,8,0.5)]',
  }[sentiment]
}

const filteredReviews = computed(() => {
  const sorted = [...allUserReviews.value]

  if (filterOption.value === 'positive') {
    return sorted.filter((r) => r.sentiment === 'positive')
  } else if (filterOption.value === 'negative') {
    return sorted.filter((r) => r.sentiment === 'negative')
  } else if (filterOption.value === 'neutral') {
    return sorted.filter((r) => r.sentiment === 'neutral')
  } else if (filterOption.value === 'oldest') {
    return sorted.sort((a, b) => a.createdAt - b.createdAt)
  } else {
    return sorted.sort((a, b) => b.createdAt - a.createdAt)
  }
})

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * reviewsPerPage
  const end = start + reviewsPerPage
  return filteredReviews.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredReviews.value.length / reviewsPerPage))

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(filterOption, () => {
  currentPage.value = 1
})

onMounted(async () => {
  if (currentUser.value?.uid) {
    allUserReviews.value = await getReviewsByUser(currentUser.value.uid)
  }
})
</script>
