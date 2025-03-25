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

  <!-- Remove top padding if NavBar is hidden -->
  <div :class="[hideNav ? 'px-4' : 'pt-[120px] px-4']">
    <router-view />
  </div>
</template>
