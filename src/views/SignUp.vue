<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 pb-16">
    <!-- LOGO + TITLE (Outside the card) -->
    <router-link to="/" class="flex items-center space-x-3 mb-6">
      <img src="@/assets/img/blog-icon.svg" class="h-10 w-10" />
      <span class="text-2xl font-bold text-gray-800">SentimentCinema</span>
    </router-link>
    <div class="w-[380px] bg-white rounded-xl shadow-xl overflow-hidden">
      <div
        class="text-white text-3xl font-bold text-center py-6 bg-gradient-to-r from-purple-500 to-blue-500"
      >
        Signup
      </div>
      <router-link
        to="/"
        class="absolute top-5 left-5 bg-blue-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-gray-200 transition"
      >
        ← Back to Home
      </router-link>

      <form @submit.prevent="signUp" class="px-8 py-6">
        <!-- Full Name -->
        <div class="mb-5">
          <input
            v-model="name"
            type="name"
            required
            placeholder="Name"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            value="Signup"
            class="w-full py-3 text-white text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 rounded-full cursor-pointer hover:opacity-90 transition"
          />
        </div>

        <div class="text-center text-sm text-gray-700">
          Already a member?
          <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const name = ref('')
const router = useRouter()

const signUp = async () => {
  try {
    // Step 1: Create user in Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Step 2: Store additional info in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email.value,
      name: name.value,
      createdAt: new Date(),
    })

    Swal.fire({
      icon: 'success',
      title: 'Signup Successful!',
      text: 'Welcome to SentimentCinema!',
      timer: 2000,
      showConfirmButton: false,
    })

    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Signup Failed',
      text: error.message,
    })
  }
}
</script>
