import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/tailwind.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebaseConfig'
import { currentUser } from './firebase/userState'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const app = createApp(App)

app.use(router)

// watch auth changes
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

app.mount('#app')
