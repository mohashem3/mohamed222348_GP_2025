<script setup>
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Track if the current page is login/signup
const hideNav = computed(() => {
  return route.name === 'LogIn' || route.name === 'SignUp'
})
</script>

<template>
  <!-- Hide NavBar if we're on LogIn or SignUp -->
  <NavBar v-if="!hideNav" />

  <!-- Add padding only if NavBar is visible -->
  <main :class="[hideNav ? 'px-4' : 'pt-[1250px] px-4']">
    <router-view />
  </main>
</template>
