// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import './assets/tailwind.css'
// import { onAuthStateChanged } from 'firebase/auth'
// import { auth } from './firebase/firebaseConfig'
// import { currentUser } from './firebase/userState'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// const app = createApp(App)

// app.use(router)

// // watch auth changes
// onAuthStateChanged(auth, (user) => {
//   currentUser.value = user
// })

// app.mount('#app')

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

// Delay app mount until Firebase auth is ready
let app
onAuthStateChanged(auth, (user) => {
  currentUser.value = user

  if (!app) {
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
})
