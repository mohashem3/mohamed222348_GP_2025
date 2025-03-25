import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MovieList from '@/views/MovieList.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import Swal from 'sweetalert2'
import { currentUser } from '@/firebase/userState'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/signup', component: SignUp, name: 'SignUp' },
    { path: '/login', component: LogIn, name: 'LogIn' },
    { path: '/movies', component: MovieList, name: 'Movies' },
    {
      path: '/movie/:id',
      name: 'MovieDetails',
      component: MovieDetails,
      props: true,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

const protectedRoutes = ['/profile', '/movies']

router.beforeEach((to, from, next) => {
  if (protectedRoutes.includes(to.path) && !currentUser.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Access Denied',
      text: 'You must log in first to access this page.',
      confirmButtonColor: '#6366f1',
    })
    next(false) // Cancel navigation
  } else {
    next() // Allow navigation
  }
})

export default router
