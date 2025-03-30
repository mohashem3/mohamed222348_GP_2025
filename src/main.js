import './assets/main.css'
import './assets/tailwind.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebaseConfig'
import { currentUser } from './firebase/userState'

import Swal from 'sweetalert2'

// ✅ GLOBAL SWEETALERT STYLE FIX
Swal.mixin({
  customClass: {
    confirmButton: 'bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-lg',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg',
  },
  buttonsStyling: false,
})

let app
onAuthStateChanged(auth, (user) => {
  currentUser.value = user

  if (!app) {
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
})
