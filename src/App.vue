<script setup>
import NavBar from './components/NavBar.vue'
import MainFooter from './components/MainFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideNav = computed(() => route.name === 'LogIn' || route.name === 'SignUp')
</script>

<template>
  <div class="w-full min-h-screen flex flex-col">
    <!-- Full-width Navbar -->
    <NavBar v-if="!hideNav" />

    <!-- Constrained content only -->
    <main :class="[hideNav ? 'px-4' : 'pt-20']" class="flex-1">
      <div class="max-w-[1280px] mx-auto w-full px-4">
        <router-view />
      </div>
    </main>

    <!-- Full-width Footer -->
    <MainFooter />
  </div>
</template>
