<template>
  <div
    class="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition duration-300 w-[240px]"
  >
    <!-- Poster -->
    <div class="relative">
      <img :src="poster" :alt="title" class="w-full h-72 object-cover" />

      <!-- Sentiment Badge -->
      <div
        v-if="sentiment !== null && sentiment !== undefined"
        class="absolute bottom-2 right-2 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full"
      >
        {{ sentiment }}% Positive
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 tracking-tight truncate mb-1">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-500">
        {{ genreName }}<span v-if="releaseYear"> ({{ releaseYear }})</span>
      </p>

      <!-- Button -->
      <button
        @click="handleReview"
        class="w-full mt-4 bg-gray-100 text-sm text-gray-800 font-medium py-2 rounded-md hover:bg-gray-200 transition"
      >
        Add Review
      </button>
    </div>
  </div>
</template>

<script>
// Genre map
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
    sentiment: Number,
    genre: Array,
    releaseDate: String,
  },
  computed: {
    genreName() {
      const id = this.genre?.[0]
      return GENRE_MAP[id] || 'Unknown'
    },
    releaseYear() {
      return this.releaseDate ? new Date(this.releaseDate).getFullYear() : null
    },
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
  },
}
</script>
