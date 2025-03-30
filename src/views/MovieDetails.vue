<template>
  <div class="bg-white p-12 rounded-2xl max-w-7xl mx-auto my-20 pt-[50px]">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <!-- Poster -->
      <div>
        <img :src="posterUrl" alt="Movie Poster" class="rounded-xl w-full object-cover h-[600px]" />
      </div>

      <!-- Info -->

      <div class="flex flex-col justify-between h-full">
        <div>
          <div
            v-if="sentiment"
            :class="[
              'inline-block text-xs font-bold px-3 py-1 rounded-full mb-2',
              sentiment.label === 'Positive'
                ? 'bg-green-600 text-white'
                : sentiment.label === 'Negative'
                  ? 'bg-red-600 text-white'
                  : sentiment.label === 'Mixed'
                    ? 'bg-gray-300 text-black'
                    : 'bg-black text-white',
            ]"
          >
            <template v-if="sentiment.percentage !== null">
              <span>{{ sentiment.percentage }}%</span> {{ sentiment.label }}
            </template>
            <template v-else>
              {{ sentiment.label }}
            </template>
          </div>

          <h1 class="text-4xl font-bold text-black mb-4">{{ movie?.title || 'Loading...' }}</h1>
          <p class="text-gray-800 text-base leading-relaxed mb-8">
            {{ movie?.overview || 'No description available.' }}
          </p>
          <!-- Star Rating -->
          <div class="flex items-center gap-1 text-yellow-400 text-xl mb-6">
            <template v-for="n in 5" :key="n">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
                :class="n <= starRating ? 'text-yellow-400' : 'text-gray-300'"
              >
                <path
                  d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
                />
              </svg>
            </template>
          </div>

          <!-- Info Table -->
          <div class="mb-10">
            <table
              class="w-full text-sm text-left text-gray-800 border border-gray-300 rounded-lg overflow-hidden"
            >
              <tbody>
                <tr class="border-b border-gray-300">
                  <th class="bg-gray-100 px-4 py-2 font-medium text-black">Release Year</th>
                  <td class="px-4 py-2">{{ releaseYear }}</td>
                </tr>
                <tr class="border-b border-gray-300">
                  <th class="bg-gray-100 px-4 py-2 font-medium text-black">Genre</th>
                  <td class="px-4 py-2">{{ genreName }}</td>
                </tr>
                <tr class="border-b border-gray-300">
                  <th class="bg-gray-100 px-4 py-2 font-medium text-black">Budget</th>
                  <td class="px-4 py-2">{{ formattedBudget }}</td>
                </tr>
                <tr class="border-b border-gray-300">
                  <th class="bg-gray-100 px-4 py-2 font-medium text-black">Revenue</th>
                  <td class="px-4 py-2">{{ formattedRevenue }}</td>
                </tr>
                <tr v-if="productionCompany">
                  <th class="bg-gray-100 px-4 py-2 font-medium text-black">Production</th>
                  <td class="px-4 py-2">{{ productionCompany }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Buttons -->
          <div class="flex flex-wrap gap-4 mt-8">
            <!-- Trailer -->
            <button
              v-if="trailerUrl"
              @click="openTrailer"
              class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold min-w-[160px] text-center"
            >
              ▶ Watch Trailer
            </button>

            <!-- Movie
            <button
              class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold min-w-[160px] text-center"
            >
              🎬 Watch Movie
            </button> -->

            <!-- Watchlist -->
            <button
              @click="toggleFavorite"
              class="px-6 py-3 rounded-lg font-semibold flex items-center justify-center min-w-[220px] transition text-center"
              :class="
                isFavorite
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              "
            >
              <span>{{ isFavorite ? '❤️ In Watchlist' : '🤍 Add to Watchlist' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cast Section -->
  <div class="bg-gray-100 py-12 mt-20 mb-10 shadow-inner">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Cast</h2>
    <div class="max-w-6xl mx-auto px-4 relative">
      <swiper
        :modules="[Navigation]"
        :slides-per-view="6"
        :space-between="10"
        navigation
        grabCursor
        class="pb-4"
      >
        <swiper-slide v-for="actor in cast" :key="actor.id">
          <div class="flex flex-col items-center text-center bg-white rounded-lg p-3 shadow-sm">
            <img
              :src="
                actor.profile_path
                  ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path
                  : 'https://placehold.co/80x100?text=No+Image'
              "
              alt="Actor"
              class="rounded-md w-20 h-28 object-cover mb-2"
            />
            <p class="text-xs font-semibold text-gray-800 truncate">{{ actor.name }}</p>
            <p class="text-[11px] text-gray-500 truncate italic">
              {{ actor.character || actor.job }}
            </p>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <!-- Streaming Providers Section -->
  <div v-if="providers.length" class="bg-gray-100 py-12 mt-20 mb-10 shadow-inner">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Available On</h2>
    <div class="max-w-6xl mx-auto px-4 relative">
      <swiper
        :modules="[Navigation]"
        :slides-per-view="5"
        :space-between="100"
        navigation
        grabCursor
        class="pb-4"
      >
        <swiper-slide v-for="provider in providers" :key="provider.provider_id">
          <a
            :href="getProviderLink(provider.provider_name)"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center text-center bg-white rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
              :alt="provider.provider_name"
              class="w-12 h-12 object-contain mb-2"
            />
            <p class="text-sm font-bold text-gray-800 truncate">{{ provider.provider_name }}</p>
          </a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <!-- Analytics Section -->
  <div class="max-w-6xl mx-auto my-16">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Audience Insights</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4 text-center">Sentiment Analysis</h3>
        <div
          v-if="pieChartData.datasets[0].data.some((d) => d > 0)"
          class="flex justify-center mb-10"
        >
          <div class="max-w-xs w-full">
            <Pie :data="pieChartData" :options="pieChartOptions" />
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4 text-center">Rating Distribution</h3>
        <RatingChart :movieId="movieId" />
      </div>
    </div>
  </div>

  <!-- Review Section -->
  <ReviewSection :movieId="movieId" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import ReviewSection from '@/components/ReviewSection.vue'
import RatingChart from '@/components/charts/RatingChart.vue'
import { listenToReviews } from '@/firebase/reviewService'

// import { getReviewsForMovie } from '@/firebase/reviewService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const route = useRoute()
const movieId = route.params.id
const movie = ref(null)
const cast = ref([])
const trailerUrl = ref(null)
const sentiment = ref(null)
const starRating = ref(0)

const pieChartData = ref({
  labels: ['Positive', 'Negative'],
  datasets: [
    {
      backgroundColor: ['#10B981', '#EF4444'],
      data: [0, 0],
    },
  ],
})

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#374151',
        font: {
          size: 14,
        },
      },
    },
  },
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

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

const fetchMovieDetails = async () => {
  try {
    const [movieRes, creditsRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
    ])
    movie.value = movieRes.data

    const fullCast = creditsRes.data.cast.slice(0, 12)
    const director = creditsRes.data.crew.find((c) => c.job === 'Director')
    if (director) {
      fullCast.unshift({ ...director, character: 'Director' })
    }
    cast.value = fullCast

    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`,
    )
    const trailers = videoRes.data.results.filter(
      (video) => video.type === 'Trailer' && video.site === 'YouTube',
    )
    trailerUrl.value = trailers.length ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null
  } catch (err) {
    console.error('Failed to fetch movie details:', err)
  }
}

const openTrailer = () => {
  if (trailerUrl.value) {
    window.open(trailerUrl.value, '_blank')
  }
}

const posterUrl = computed(() =>
  movie.value?.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.value.poster_path}`
    : 'https://placehold.co/80x100?text=No+Image',
)

const releaseYear = computed(() =>
  movie.value?.release_date ? new Date(movie.value.release_date).getFullYear() : 'N/A',
)

const genreName = computed(() => {
  const genreId = movie.value?.genres?.[0]?.id
  return genreId ? GENRE_MAP[genreId] || 'Unknown' : 'Unknown'
})

const productionCompany = computed(() => movie.value?.production_companies?.[0]?.name || null)

const formattedBudget = computed(() =>
  movie.value?.budget ? `$${movie.value.budget.toLocaleString()}` : 'N/A',
)

const formattedRevenue = computed(() =>
  movie.value?.revenue ? `$${movie.value.revenue.toLocaleString()}` : 'N/A',
)

const isFavorite = ref(false)

const checkFavorite = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return

  const favRef = doc(db, 'users', user.uid, 'watchlist', String(movieId))
  const docSnap = await getDoc(favRef)
  isFavorite.value = docSnap.exists()
}

const toggleFavorite = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return alert('You need to be logged in.')

  const favRef = doc(db, 'users', user.uid, 'watchlist', String(movieId))
  if (isFavorite.value) {
    await deleteDoc(favRef)
    isFavorite.value = false
  } else {
    await setDoc(favRef, {
      movieId: movie.value.id,
      title: movie.value.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`,
      addedAt: new Date(),
    })
    isFavorite.value = true
  }
}

const providers = ref([])

const PROVIDER_LINKS = {
  Netflix: 'https://www.netflix.com/',
  'Disney Plus': 'https://www.disneyplus.com/',
  'HBO Max': 'https://www.max.com/',
  Hulu: 'https://www.hulu.com/',
  'Amazon Video': 'https://www.primevideo.com/',
  'Apple TV': 'https://tv.apple.com/',
  Peacock: 'https://www.peacocktv.com/',
  'Paramount Plus': 'https://www.paramountplus.com/',
  YouTube: 'https://www.youtube.com/',
  'Google Play Movies': 'https://play.google.com/store/movies',
  Vudu: 'https://www.vudu.com/',
  'Fandango At Home': 'https://www.vudu.com/',
}

const fetchProviders = async () => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`,
    )
    const data = res.data.results?.US
    const all = [
      ...(data?.flatrate || []),
      ...(data?.buy || []),
      ...(data?.rent || []),
      ...(data?.ads || []),
    ]
    const unique = Array.from(new Map(all.map((p) => [p.provider_id, p])).values())
    providers.value = unique
  } catch (err) {
    console.error('Failed to fetch providers:', err)
  }
}

const getProviderLink = (name) => {
  return PROVIDER_LINKS[name] || ''
}

onMounted(async () => {
  await fetchMovieDetails()
  await checkFavorite()
  await fetchProviders()
  // 🔁 Real-time chart updates
  listenToReviews(movieId, (reviews) => {
    const total = reviews.length
    const positives = reviews.filter((r) => r.sentiment === 'positive').length
    const negatives = reviews.filter((r) => r.sentiment === 'negative').length

    // Update pie chart
    pieChartData.value.datasets[0].data = [positives, negatives]

    // Update sentiment label
    if (total === 0) {
      sentiment.value = { label: 'No Reviews', percentage: null }
      starRating.value = 0
    } else {
      const ratio = positives / total
      if (ratio >= 0.8) starRating.value = 5
      else if (ratio >= 0.6) starRating.value = 4
      else if (ratio >= 0.4) starRating.value = 3
      else if (ratio >= 0.2) starRating.value = 2
      else if (ratio > 0) starRating.value = 1
      else starRating.value = 0

      if (positives > negatives) {
        sentiment.value = {
          label: 'Positive',
          percentage: Math.round((positives / total) * 100),
        }
      } else if (negatives > positives) {
        sentiment.value = {
          label: 'Negative',
          percentage: Math.round((negatives / total) * 100),
        }
      } else {
        sentiment.value = { label: 'Mixed', percentage: null }
      }
    }
  })
})
</script>
