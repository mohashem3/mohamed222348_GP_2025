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

        <!-- Search -->
        <div class="w-full max-w-md mx-6 relative">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              @keydown.enter.prevent
              type="text"
              placeholder="Search for movies..."
              class="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <!-- Dropdown -->
          <ul
            v-if="searchResults.length > 0"
            class="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
          >
            <li
              v-for="result in searchResults"
              :key="result.id"
              @click="goToMovie(result.id, result.title)"
              class="px-5 py-3 text-gray-800 font-medium hover:bg-pink-100 hover:text-pink-800 transition duration-200 cursor-pointer"
            >
              {{ result.title }}
            </li>
          </ul>
        </div>

        <!-- Right Side Buttons -->
        <div class="flex items-center space-x-3">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
              >LOG IN</router-link
            >
            <router-link
              to="/signup"
              class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
              >SIGN UP</router-link
            >
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
                to="/userprofile"
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
          to="/userprofile"
          class="px-4 py-2 rounded-md no-underline text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
          >PROFILE</router-link
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
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import Swal from 'sweetalert2'
import { currentUser } from '@/firebase/userState'
import { searchMovies } from '@/services/tmdb'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])

const avatarURL = computed(() => {
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  } else {
    const name = currentUser.value?.name || 'Anonymous'
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&chars=2`
  }
})

const handleSearch = async () => {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  const results = await searchMovies(searchQuery.value.trim())
  searchResults.value = results.slice(0, 5) // limit results
}

const goToMovie = (id, title) => {
  searchResults.value = []
  searchQuery.value = ''
  router.push({ name: 'MovieDetails', params: { id }, query: { title } })
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

const isLoggedIn = computed(() => currentUser.value !== null)
const displayName = computed(() => currentUser.value?.name || 'User')
</script>
