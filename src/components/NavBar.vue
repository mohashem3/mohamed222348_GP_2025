<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top Bar -->
      <div class="flex items-center justify-between py-3">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <router-link to="/">
            <img src="@/assets/img/blog-icon.svg" alt="Logo" class="w-8 h-8" />
          </router-link>
          <router-link to="/" class="text-xl font-bold text-white no-underline hover:text-pink-400">
            SentimentCinema
          </router-link>
        </div>

        <!-- Search Type + Input Container -->
        <div class="w-full max-w-md mx-6 relative z-50">
          <!-- Input + Type Selector -->
          <div
            class="flex bg-gray-800 text-white rounded-md overflow-hidden shadow-sm ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-pink-500"
          >
            <!-- Search Type Button -->
            <button
              @click="showTypeDropdown = !showTypeDropdown"
              class="flex items-center justify-between w-28 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium border-r border-gray-600 focus:outline-none"
            >
              {{ searchType.charAt(0).toUpperCase() + searchType.slice(1) }}
              <svg
                class="w-4 h-4 ml-1 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Input Field -->
            <div class="flex-grow relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pr-2">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"
                  />
                </svg>
              </div>

              <input
                v-model="searchQuery"
                @input="handleSearch"
                @keydown.enter.prevent="handleEnterKey"
                type="text"
                placeholder="Search for movies..."
                class="w-full pl-12 pr-4 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <!-- SEARCH RESULTS DROPDOWN -->
          <ul
            v-if="searchQuery && searchResults.length > 0"
            class="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
          >
            <li
              v-for="result in searchResults"
              :key="result.id"
              @click="
                searchType === 'title'
                  ? goToMovie(result.id, result.title)
                  : searchType === 'actor'
                    ? goToActor(result)
                    : searchType === 'director'
                      ? goToDirector(result)
                      : searchType === 'genre'
                        ? goToGenre(result)
                        : null
              "
              class="px-5 py-3 text-gray-800 font-medium hover:bg-pink-100 hover:text-pink-800 transition duration-200 cursor-pointer"
            >
              {{ searchType === 'title' ? result.title : result.name }}
            </li>
          </ul>

          <!-- ABSOLUTE DROPDOWN OUTSIDE FLEX -->
          <ul
            v-if="showTypeDropdown"
            class="absolute left-0 mt-2 w-32 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <li v-for="type in ['title', 'actor', 'director', 'genre']" :key="type">
              <button
                @click="selectSearchType(type)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-800 transition"
              >
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Right Side Buttons -->
        <div class="flex items-center space-x-3">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              LOG IN
            </router-link>
            <router-link
              to="/signup"
              class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              SIGN UP
            </router-link>
          </template>
          <template v-else>
            <div class="flex items-center gap-6">
              <button
                @click="logout"
                class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
              >
                LOG OUT
              </button>
              <router-link
                to="/dashboard"
                class="flex flex-col no-underline items-center text-white"
              >
                <img
                  :src="avatarURL"
                  alt="User"
                  class="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
                <span class="text-sm font-medium mt-1">{{ displayName }}</span>
              </router-link>
            </div>
          </template>
        </div>
      </div>

      <!-- Nav Links -->
      <div class="border-t border-gray-700 pt-2 pb-3 flex justify-center space-x-6 text-sm">
        <router-link
          to="/"
          class="px-4 py-2 rounded-md no-underline font-semibold text-white bg-gray-800 hover:bg-gray-700"
          exact-active-class="bg-gray-700"
          >HOME</router-link
        >
        <router-link
          to="/about"
          class="px-4 py-2 rounded-md no-underline text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
          >ABOUT</router-link
        >
        <router-link
          to="/movies"
          class="px-4 py-2 rounded-md no-underline text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
          >MOVIES</router-link
        >
        <router-link
          to="/compare"
          class="px-4 py-2 rounded-md no-underline text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
          >COMPARE</router-link
        >
        <router-link
          to="/dashboard"
          class="px-4 py-2 rounded-md no-underline font-semibold text-white bg-gray-800 hover:bg-gray-700"
          exact-active-class="bg-gray-700"
          >DASHBOARD</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import Swal from 'sweetalert2'
import { currentUser } from '@/firebase/userState'

import {
  searchMoviesByTitle,
  searchActors,
  searchDirectors,
  getGenreSuggestions,
} from '@/services/tmdb'

const router = useRouter()

const searchQuery = ref('')
const searchResults = ref([])
const searchType = ref('title')
const showTypeDropdown = ref(false)

const avatarURL = computed(() => {
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  } else {
    const name = currentUser.value?.name || 'Anonymous'
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&chars=2`
  }
})

const handleSearch = async () => {
  const query = searchQuery.value.trim()
  if (query.length < 2) {
    searchResults.value = []
    return
  }

  let results = []
  try {
    if (searchType.value === 'title') {
      results = await searchMoviesByTitle(query)
    } else if (searchType.value === 'actor') {
      results = await searchActors(query)
    } else if (searchType.value === 'director') {
      results = await searchDirectors(query) // ← fix
    } else if (searchType.value === 'genre') {
      results = getGenreSuggestions(query)
    }
  } catch (err) {
    console.error(`Search failed for type ${searchType.value}:`, err)
  }

  searchResults.value = results.slice(0, 5)
}

const goToMovie = (id, title) => {
  searchResults.value = []
  searchQuery.value = ''
  router.push({ name: 'MovieDetails', params: { id }, query: { title } })
}

const goToActor = (actor) => {
  searchResults.value = []
  searchQuery.value = ''
  router.push({ name: 'Movies', query: { actor: actor.id, name: actor.name } })
}

const goToDirector = (person) => {
  searchQuery.value = ''
  searchResults.value = []
  router.push({ name: 'Movies', query: { director: person.name } })
}

const goToGenre = (genre) => {
  searchResults.value = []
  searchQuery.value = ''
  router.push({ name: 'Movies', query: { genre: genre.name.toLowerCase() } })
}

const handleEnterKey = () => {
  const query = searchQuery.value.trim()
  if (!query) return

  if (searchType.value === 'title') {
    router.push({ name: 'Movies', query: { title: query } })
  } else if (searchType.value === 'actor') {
    router.push({ name: 'Movies', query: { actor: query } })
  } else if (searchType.value === 'director') {
    router.push({ name: 'Movies', query: { director: query } })
  } else if (searchType.value === 'genre') {
    router.push({ name: 'Movies', query: { genre: query } })
  }

  searchQuery.value = ''
  searchResults.value = []
}

const selectSearchType = (type) => {
  searchType.value = type
  showTypeDropdown.value = false
  handleSearch()
}

function logout() {
  signOut(auth)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have been logged out successfully.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-right',
      })
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Something went wrong while logging out.',
        confirmButtonColor: '#e53e3e',
      })
    })
}

watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    searchResults.value = []
  }
})

const isLoggedIn = computed(() => currentUser.value !== null)
const displayName = computed(() => currentUser.value?.name || 'User')
</script>
