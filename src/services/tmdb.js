import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`)
    return response.data // Return full response (results + total pages)
  } catch (error) {
    console.error('Error fetching movies:', error)
    return { results: [], total_pages: 1 } // Return empty data if error occurs
  }
}

export const fetchMoviesByGenre = async (genreId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
    )
    return response.data.results
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error)
    return []
  }
}

// tmdb.js
export const searchMovies = async (query) => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
  )
  const data = await response.json()
  return data.results
}
