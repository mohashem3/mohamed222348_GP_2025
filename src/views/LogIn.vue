<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)

    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Welcome back 👋',
      timer: 2000,
      showConfirmButton: false,
    })

    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message,
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white-50 pt-12">
    <!-- LOGO + TITLE (Outside the card) -->
    <router-link to="/" class="flex items-center space-x-3 mb-6">
      <img src="@/assets/img/blog-icon.svg" class="h-10 w-10" />
      <span class="text-2xl font-bold text-gray-800">SentimentCinema</span>
    </router-link>

    <div class="w-[380px] bg-white rounded-xl shadow-xl overflow-hidden">
      <div
        class="text-white text-3xl font-bold text-center py-6 bg-gradient-to-r from-purple-500 to-blue-500"
      >
        Login
      </div>
      <!-- Add above your login/signup form -->

      <router-link
        to="/"
        class="absolute top-5 left-5 bg-blue-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-gray-200 transition"
      >
        ← Back to Home
      </router-link>

      <form @submit.prevent="login" class="px-8 py-6">
        <div class="mb-5">
          <input
            v-model="email"
            type="email"
            required
            placeholder="Email Address"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-5">
          <input
            v-model="password"
            type="password"
            required
            placeholder="Password"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p v-if="errorMessage" class="text-red-600 text-sm mb-3">{{ errorMessage }}</p>

        <div class="mb-5">
          <input
            type="submit"
            value="Login"
            class="w-full py-3 text-white text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 rounded-full cursor-pointer hover:opacity-90 transition"
          />
        </div>

        <div class="text-center text-sm text-gray-700">
          Not a member?
          <router-link to="/signup" class="text-blue-500 hover:underline">Signup now</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
