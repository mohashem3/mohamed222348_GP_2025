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
          <router-link to="/" class="text-xl font-bold">SentimentCinema</router-link>
        </div>

        <!-- Search -->
        <div class="w-full max-w-md mx-6">
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
              type="text"
              placeholder="Search"
              class="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <!-- Right Side Buttons + Avatar -->
        <div class="flex items-center space-x-3">
          <!-- When user is NOT logged in -->
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

          <!-- When user IS logged in -->
          <template v-else>
            <button
              @click="logout"
              class="bg-pink-500 hover:bg-cyan-500 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              LOG OUT
            </button>

            <!-- Profile Icon -->
            <router-link to="/profile">
              <img
                src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                alt="User"
                class="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-white"
              />
            </router-link>
          </template>
        </div>
      </div>

      <!-- Bottom Nav Links (Centered under search) -->
      <div class="border-t border-gray-700 pt-2 pb-3 flex justify-center space-x-6 text-sm">
        <router-link
          to="/"
          class="px-4 py-2 rounded-md font-semibold text-white bg-gray-800 hover:bg-gray-700"
          exact-active-class="bg-gray-700"
        >
          HOME
        </router-link>
        <router-link
          to="/about"
          class="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
        >
          ABOUT
        </router-link>
        <router-link
          to="/profile"
          class="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
        >
          PROFILE
        </router-link>
        <router-link
          to="/movies"
          class="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          exact-active-class="text-white"
        >
          MOVIES
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { currentUser } from '@/firebase/userState'
import { computed } from 'vue'
import Swal from 'sweetalert2'

const router = useRouter()

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
</script>
