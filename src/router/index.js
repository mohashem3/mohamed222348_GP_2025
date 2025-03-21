import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MovieList from '@/views/MovieList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/signup', component: SignUp },
    { path: '/login', component: LogIn },
    { path: '/movies', component: MovieList },
  ],
})

export default router
