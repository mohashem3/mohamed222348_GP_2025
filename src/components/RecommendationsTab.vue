<template>
  <div class="px-6">
    <h2 class="text-2xl mb-6 font-bold text-gray-800">Recommendations</h2>
    <!-- Review-Based Recommendations -->
    <div
      class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6"
    >
      <h3 class="text-2xl font-bold mb-3">Your Personalized Movie Picks 🍿</h3>
      <p class="text-sm md:text-base">
        Based on your
        <span class="font-bold text-yellow-200">Review History</span>, we found your favorite genre
        is:
        <span
          class="inline-block bg-white text-purple-700 font-semibold text-sm px-3 py-[2px] rounded-full shadow-[0_0_12px_rgba(139,92,246,0.9)] mx-1"
        >
          {{ favoriteGenreName }}
        </span>
      </p>
      <p class="text-sm md:text-base mt-1">Here are some handpicked movies we think you'll love.</p>
    </div>

    <div v-if="recommendedMovies.length" class="mb-10">
      <Swiper
        :slides-per-view="1.2"
        :space-between="15"
        :breakpoints="{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }"
        :modules="[Navigation]"
        :navigation="true"
        class="mySwiper"
      >
        <SwiperSlide v-for="movie in recommendedMovies" :key="movie.id">
          <MovieCard
            :movie-id="movie.id"
            :title="movie.title"
            :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            :genre="movie.genre_ids"
            :release-date="movie.release_date"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <p v-else class="text-gray-500 mb-12">No review-based recommendations available yet.</p>

    <!-- Watchlist-Based Recommendations -->
    <div
      class="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-lg mb-6"
    >
      <h3 class="text-2xl font-bold mb-3">More Suggestions Based on Your Watchlist 🎯</h3>
      <p class="text-sm md:text-base">
        Based on your
        <span class="font-bold text-yellow-100">Watchlist</span>, it looks like you're into
        <span
          class="inline-block bg-white text-rose-600 font-semibold text-sm px-3 py-[2px] rounded-full shadow-[0_0_12px_rgba(244,114,182,0.9)] mx-1"
        >
          {{ favoriteWatchlistGenreName }}
        </span>
      </p>
      <p class="text-sm md:text-base mt-1">These picks might also be your taste:</p>
    </div>

    <div v-if="watchlistBasedRecommendations.length" class="mb-10">
      <Swiper
        :slides-per-view="1.2"
        :space-between="15"
        :breakpoints="{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }"
        :modules="[Navigation]"
        :navigation="true"
        class="mySwiper"
      >
        <SwiperSlide v-for="movie in watchlistBasedRecommendations" :key="movie.id">
          <MovieCard
            :movie-id="movie.id"
            :title="movie.title"
            :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            :genre="movie.genre_ids"
            :release-date="movie.release_date"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <p v-else class="text-gray-500 mb-12">No watchlist-based recommendations available yet.</p>

    <!-- Actor-Based Recommendations -->
    <div
      class="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6"
    >
      <h3 class="text-2xl font-bold mb-3">Movies Featuring Your Top-Rated Actors 🌟</h3>
      <p class="text-sm md:text-base">
        Based on your
        <span class="font-bold text-yellow-100">Actor Ratings</span>, we noticed you enjoy
        performances by:
      </p>
      <div class="flex flex-wrap gap-2 mt-2 mb-1">
        <span
          v-for="(actor, index) in topRatedActorNames"
          :key="index"
          class="inline-block bg-white text-blue-700 font-semibold text-sm px-4 py-1 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]"
        >
          {{ actor }}
        </span>
      </div>
      <p class="text-sm md:text-base">Here are some of their best movies:</p>
    </div>

    <div v-if="Object.keys(actorMovieMap).length">
      <div v-for="(movies, actorName) in actorMovieMap" :key="actorName" class="mb-10">
        <div
          class="inline-block bg-white text-blue-800 text-sm font-semibold px-4 py-[6px] rounded-full shadow mb-4"
        >
          {{ actorName }}'s Movies
        </div>

        <Swiper
          :slides-per-view="1.2"
          :space-between="15"
          :breakpoints="{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }"
          :modules="[Navigation]"
          :navigation="true"
          :pagination="false"
          class="mySwiper"
        >
          <SwiperSlide v-for="movie in movies" :key="movie.id">
            <MovieCard
              :movie-id="movie.id"
              :title="movie.title"
              :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
              :genre="movie.genre_ids"
              :release-date="movie.release_date"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <p v-else class="text-gray-500">No actor-based recommendations available yet.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { currentUser } from '@/firebase/userState'
import { getReviewsByUser } from '@/firebase/reviewService'
import { getMoviesByGenre, getGenreMap, getActorMovies } from '@/services/tmdb'
import { db } from '@/firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import MovieCard from '@/components/MovieCard.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation } from 'swiper/modules'

const allUserReviews = ref([])
const watchlistMovies = ref([])

const favoriteGenreId = ref(null)
const favoriteGenreName = ref('')
const recommendedMovies = ref([])

const favoriteWatchlistGenreId = ref(null)
const favoriteWatchlistGenreName = ref('')
const watchlistBasedRecommendations = ref([])

const topRatedActorIds = ref([])
const topRatedActorNames = ref([])
//const actorBasedRecommendations = ref([])

const detectFavoriteGenre = async () => {
  const genreCount = {}
  const genreMap = await getGenreMap()

  for (const review of allUserReviews.value) {
    if (review.sentiment !== 'positive') continue

    const genres = review.genre_ids
    if (Array.isArray(genres)) {
      for (const gid of genres) {
        genreCount[gid] = (genreCount[gid] || 0) + 1
      }
    }
  }

  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  if (sorted.length > 0) {
    const [topGenreId] = sorted[0]
    favoriteGenreId.value = parseInt(topGenreId)

    const nameEntry = Object.entries(genreMap).find(
      ([id]) => parseInt(id) === favoriteGenreId.value,
    )
    favoriteGenreName.value = nameEntry ? nameEntry[1] : 'Unknown'
  } else {
    favoriteGenreId.value = null
    favoriteGenreName.value = 'None yet'
  }
}

const detectWatchlistFavoriteGenre = async () => {
  const genreCount = {}
  const genreMap = await getGenreMap()

  for (const movie of watchlistMovies.value) {
    const genreName = movie.primaryGenre?.trim()
    if (genreName) {
      genreCount[genreName] = (genreCount[genreName] || 0) + 1
    }
  }

  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  if (sorted.length > 0) {
    const [topGenreName] = sorted[0]
    favoriteWatchlistGenreName.value = topGenreName

    const genreEntry = Object.entries(genreMap).find(([, name]) => name === topGenreName)
    favoriteWatchlistGenreId.value = genreEntry ? parseInt(genreEntry[0]) : null
  } else {
    favoriteWatchlistGenreName.value = 'None yet'
    favoriteWatchlistGenreId.value = null
  }
}

const detectTopRatedActors = async () => {
  const userId = currentUser.value?.uid
  if (!userId) return

  const castRatingsSnap = await getDocs(collection(db, 'users', userId, 'cast_ratings'))
  const ratings = castRatingsSnap.docs.map((doc) => doc.data())

  // 💡 Only include ACTORS with exactly 5-star rating
  const topRatedOnly = ratings.filter((r) => r.role === 'Actor' && Number(r.rating) === 5)

  // 🧠 Map to hold castId → name
  const uniqueActors = new Map()

  for (const r of topRatedOnly) {
    const castId = r.castId

    // Skip if we already fetched this actor
    if (uniqueActors.has(castId)) continue

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${castId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
      )
      const data = await res.json()
      uniqueActors.set(castId, data.name || 'Unknown')
    } catch (err) {
      console.warn(`Failed to fetch actor ${castId}`, err)
      uniqueActors.set(castId, 'Unknown')
    }
  }

  // 🧩 Pick top 5 actors
  const topEntries = Array.from(uniqueActors.entries()).slice(0, 5)
  topRatedActorIds.value = topEntries.map(([id]) => id)
  topRatedActorNames.value = topEntries.map(([, name]) => name)
}

const fetchRecommendedMovies = async () => {
  if (!favoriteGenreName.value) return

  try {
    const movies = await getMoviesByGenre(favoriteGenreName.value)
    const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))
    const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))

    recommendedMovies.value = movies
      .filter((movie) => !watchlistIds.has(String(movie.id)) && !reviewedIds.has(String(movie.id)))
      .slice(0, 12)
  } catch (err) {
    console.error('Error fetching recommended movies:', err)
  }
}

const fetchWatchlistBasedRecommendations = async () => {
  if (!favoriteWatchlistGenreName.value) return

  try {
    const movies = await getMoviesByGenre(favoriteWatchlistGenreName.value)
    const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))
    const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))

    watchlistBasedRecommendations.value = movies
      .filter((movie) => !watchlistIds.has(String(movie.id)) && !reviewedIds.has(String(movie.id)))
      .slice(0, 12)
  } catch (err) {
    console.error('Error fetching watchlist-based recommendations:', err)
  }
}

const actorMovieMap = ref({}) // 💡 key: actor name, value: array of movies

const fetchActorBasedRecommendations = async () => {
  actorMovieMap.value = {} // reset

  const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))
  const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))

  for (let i = 0; i < topRatedActorIds.value.length; i++) {
    const actorId = topRatedActorIds.value[i]
    const actorName = topRatedActorNames.value[i] || 'Unknown'

    try {
      const movies = await getActorMovies(actorId)
      const filtered = movies
        .filter(
          (movie) => !reviewedIds.has(String(movie.id)) && !watchlistIds.has(String(movie.id)),
        )
        .slice(0, 15)

      actorMovieMap.value[actorName] = filtered
    } catch (err) {
      console.warn(`Could not fetch movies for ${actorName}`, err)
      actorMovieMap.value[actorName] = []
    }
  }
}

onMounted(async () => {
  if (currentUser.value?.uid) {
    allUserReviews.value = await getReviewsByUser(currentUser.value.uid)

    const snap = await getDocs(collection(db, 'users', currentUser.value.uid, 'watchlist'))
    watchlistMovies.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    await detectFavoriteGenre()
    await fetchRecommendedMovies()

    await detectWatchlistFavoriteGenre()
    await fetchWatchlistBasedRecommendations()

    await detectTopRatedActors()
    await fetchActorBasedRecommendations()
  }
})
</script>

<style scoped>
/* Add this in your main CSS or in <style scoped> */
.swiper-button-prev,
.swiper-button-next {
  color: #1f2937; /* Gray-800 */
  top: 40%;
  transform: translateY(-50%);
}
</style>
