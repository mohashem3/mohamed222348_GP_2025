<template>
  <div
    class="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition duration-300 w-[240px]"
  >
    <!-- Poster -->
    <div class="relative">
      <!-- 🏅 Rank Badge -->
      <div
        v-if="rank"
        class="absolute top-2 left-2 bg-yellow-400 text-xs font-bold text-yellow-900 px-2 py-[2px] rounded-full shadow backdrop-blur-md"
        :title="`#${rank} Highest Grossing`"
      >
        #{{ rank }}
      </div>

      <router-link
        :to="{ name: 'MovieDetails', params: { id: movieId }, query: { title } }"
        class="block cursor-pointer"
      >
        <img
          :src="poster"
          :alt="title"
          class="w-full h-72 object-cover hover:opacity-90 transition"
        />
      </router-link>

      <!-- Sentiment Badge -->
      <div
        v-if="sentiment"
        :class="[
          'absolute bottom-2 right-2 text-xs font-bold px-3 py-1 rounded-full text-white',
          sentiment.label === 'Positive'
            ? 'bg-green-500 shadow-[0_0_18px_rgba(34,197,94,0.8)]'
            : sentiment.label === 'Negative'
              ? 'bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.8)]'
              : sentiment.label === 'Mixed'
                ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_18px_rgba(234,179,8,0.8)]'
                : 'bg-gray-400',
        ]"
      >
        <template v-if="sentiment.percentage !== null">
          <span>{{ sentiment.percentage }}%</span>
          {{ sentiment.label }}
        </template>
        <template v-else>
          {{ sentiment.label }}
        </template>
      </div>

      <!-- Favorite Heart Icon -->
      <div
        class="absolute top-2 right-2 cursor-pointer"
        :title="isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'"
        @click.stop="toggleFavorite"
      >
        <svg
          :class="[
            'w-6 h-6 transition',
            isFavorite ? 'fill-pink-500' : 'fill-white stroke-pink-500',
          ]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            stroke-width="1.5"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81
        4.5 2.09C13.09 3.81 14.76 3 16.5 3
        19.58 3 22 5.42 22 8.5c0 3.78-3.4
        6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
    </div>

    <!-- 💵 Revenue Badge (Only for Box Office Slider) -->
    <div
      v-if="revenue"
      class="text-xs font-semibold text-green-800 bg-green-100 px-2 py-[2px] rounded-full inline-block mx-auto mt-2"
      :title="'Box Office Revenue: $' + revenue.toLocaleString()"
    >
      ${{ revenue.toLocaleString() }}
    </div>

    <!-- Info -->
    <div class="p-4 relative">
      <h3 class="text-lg font-semibold text-gray-900 tracking-tight truncate mb-1">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-500">
        {{ genreName }}<span v-if="releaseYear"> ({{ releaseYear }})</span>
      </p>
      <div class="flex items-center gap-1 mt-1">
        <template v-for="n in 5" :key="n">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-4 h-4"
            :class="n <= starRating ? 'text-yellow-400' : 'text-gray-300'"
          >
            <path
              d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
            />
          </svg>
        </template>
      </div>

      <!-- Add Review + Review Count + Watchlist -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click.stop="handleReview"
          class="bg-gray-100 text-sm text-gray-800 font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          Add Review
        </button>

        <div
          class="text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full"
          :title="'Reviews'"
        >
          {{ reviewCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReviewsForMovie } from '@/firebase/reviewService'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

export default {
  props: {
    movieId: [String, Number],
    title: String,
    poster: String,
    genre: Array,
    releaseDate: String,
    matchedGenre: String,
    revenue: Number,
    rank: Number,
  },
  data() {
    return {
      sentiment: null,
      reviewCount: 0,
      isFavorite: false,
      starRating: 0,
    }
  },
  computed: {
    genreName() {
      if (this.matchedGenre) {
        return this.matchedGenre.charAt(0).toUpperCase() + this.matchedGenre.slice(1)
      }

      // 🎯 Support genre_ids (array of numbers)
      if (Array.isArray(this.genre) && typeof this.genre[0] === 'number') {
        const id = this.genre[0]
        return GENRE_MAP[id] || 'Unknown'
      }

      // 🎯 Support genres (array of { id, name })
      if (Array.isArray(this.genre) && typeof this.genre[0] === 'object') {
        return this.genre[0].name || 'Unknown'
      }

      return 'Unknown'
    },

    releaseYear() {
      return this.releaseDate ? new Date(this.releaseDate).getFullYear() : null
    },
  },
  async mounted() {
    try {
      const reviews = await getReviewsForMovie(String(this.movieId))
      const total = reviews.length
      this.reviewCount = total

      if (total === 0) {
        this.sentiment = { label: 'No Reviews', percentage: null }
        this.starRating = 0
        return
      }

      const positiveReviews = reviews.filter((r) => r.sentiment === 'positive').length
      const negativeReviews = reviews.filter((r) => r.sentiment === 'negative').length
      const mixedReviews = reviews.filter((r) => r.sentiment === 'mixed').length

      const positivePercent = (positiveReviews / total) * 100
      const negativePercent = (negativeReviews / total) * 100
      const mixedPercent = (mixedReviews / total) * 100

      // 🎯 Determine dominant sentiment
      if (positivePercent > 50) {
        this.sentiment = { label: 'Positive', percentage: Math.round(positivePercent) }
      } else if (negativePercent > 50) {
        this.sentiment = { label: 'Negative', percentage: Math.round(negativePercent) }
      } else if (mixedPercent > 50) {
        this.sentiment = { label: 'Mixed', percentage: Math.round(mixedPercent) }
      } else {
        this.sentiment = { label: 'Mixed', percentage: null }
      }

      // Set star rating based on actual user ratings
      if (total > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
        this.starRating = Math.round(totalRating / total)
      } else {
        this.starRating = 0
      }

      await this.checkFavorite()
    } catch (err) {
      console.error('Error loading movie card data:', err)
    }
  },
  methods: {
    handleReview() {
      if (!this.movieId) return
      this.$router.push({
        name: 'MovieDetails',
        params: { id: this.movieId },
        query: { title: this.title },
      })
    },
    async checkFavorite() {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return

      const favRef = doc(db, 'users', user.uid, 'watchlist', String(this.movieId))
      const docSnap = await getDoc(favRef)
      this.isFavorite = docSnap.exists()
    },
    async toggleFavorite() {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return alert('You need to be logged in.')

      const favRef = doc(db, 'users', user.uid, 'watchlist', String(this.movieId))
      if (this.isFavorite) {
        await deleteDoc(favRef)
        this.isFavorite = false
        this.$emit('removed', this.movieId)
      } else {
        await setDoc(favRef, {
          movieId: this.movieId,
          title: this.title,
          poster: this.poster,
          genre: this.genre,
          releaseDate: this.releaseDate,
          addedAt: new Date(),
        })

        this.isFavorite = true
      }
    },
  },
}
</script>
