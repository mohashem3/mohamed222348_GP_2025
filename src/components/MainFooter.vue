<template>
  <footer class="w-full bg-gray-900 text-gray-300 pt-12 pb-6">
    <div class="w-full px-6 md:px-16 xl:px-32">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Branding -->
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2 mb-4">
            🎬 SentimentCinema
          </h2>
          <p class="text-sm text-gray-400">
            Discover what the world feels about movies — not just what they rate them.
          </p>
        </div>

        <!-- Explore Links -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Explore</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="hover:text-indigo-400">Home</router-link></li>
            <li><router-link to="/movies" class="hover:text-indigo-400">Movies</router-link></li>
            <li><router-link to="/compare" class="hover:text-indigo-400">Compare</router-link></li>
            <li><router-link to="/about" class="hover:text-indigo-400">About Us</router-link></li>
          </ul>
        </div>

        <!-- Connect -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Connect</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="mailto:team@sentimentcinema.com" class="hover:text-indigo-400">
                📧 team@sentimentcinema.com
              </a>
            </li>
            <li class="flex gap-4 text-xl mt-2">
              <a href="#" class="hover:text-indigo-400">🐦</a>
              <a href="#" class="hover:text-indigo-400">💼</a>
              <a href="#" class="hover:text-indigo-400">📸</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        &copy; 2025 SentimentCinema. Built with ❤️ by Students.
      </div>
    </div>
  </footer>
</template>
