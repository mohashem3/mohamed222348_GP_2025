<script setup>
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideNav = computed(() => route.name === 'LogIn' || route.name === 'SignUp')
</script>

<template>
  <NavBar v-if="!hideNav" />
  <main :class="[hideNav ? 'px-4' : 'pt-20 w-full']">
    <router-view />
  </main>
</template>
