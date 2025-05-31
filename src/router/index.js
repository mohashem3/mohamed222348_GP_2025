import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MovieList from '@/views/MovieList.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import CompareView from '@/views/CompareView.vue'
import Swal from 'sweetalert2'
import { currentUser } from '@/firebase/userState'
import UserProfile from '@/views/UserProfile.vue'
import Dashboard from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/signup', component: SignUp, name: 'SignUp' },
    { path: '/login', component: LogIn, name: 'LogIn' },
    { path: '/movies', component: MovieList, name: 'Movies' },
    { path: '/compare', component: CompareView, name: 'Compare' },
    { path: '/userprofile', component: UserProfile, name: 'UserProfile' },
    { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
    {
      path: '/movie/:id',
      name: 'MovieDetails',
      component: MovieDetails,
      props: true,
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

const protectedRoutes = ['/userprofile', '/movies']

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
