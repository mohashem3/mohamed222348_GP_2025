<template>
  <div
    class="bg-white rounded-xl shadow p-6 overflow-hidden transition-all duration-300 hover:shadow-lg"
  >
    <h3 class="text-xs font-medium text-gray-500 mb-3 tracking-widest uppercase">{{ title }}</h3>
    <div class="relative h-10 overflow-hidden">
      <transition-group name="slide" tag="div" class="absolute w-full">
        <p :key="currentItem" class="text-xl font-semibold tracking-tight slide-up" :class="color">
          {{ currentItem }}
        </p>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  title: String,
  items: Array,
  color: String, // text-indigo-500, text-emerald-500 etc.
})

const currentIndex = ref(0)
const currentItem = computed(() => props.items[currentIndex.value])

let interval
onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
  }, 5000)
})
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
