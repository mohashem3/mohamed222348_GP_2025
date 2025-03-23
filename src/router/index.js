import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MovieList from '@/views/MovieList.vue'
import MovieDetails from '@/views/MovieDetails.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/signup', component: SignUp },
    { path: '/login', component: LogIn },
    { path: '/movies', component: MovieList },
    {
      path: '/movie/:id',
      name: 'MovieDetails',
      component: MovieDetails,
      props: true, // Allows passing movie ID as a prop
    },
  ],
})

export default router
