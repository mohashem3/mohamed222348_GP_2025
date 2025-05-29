import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movies:', error)
    return { results: [], total_pages: 1 }
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

// ✅ Search by Title
export const searchMoviesByTitle = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
    )
    return response.data.results
  } catch (error) {
    console.error('Error searching movies by title:', error)
    return []
  }
}

// Get actor suggestions by name
export const searchActors = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/person?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
    )
    return response.data.results || []
  } catch (error) {
    console.error('Error searching actors:', error)
    return []
  }
}

// Get full movie credits for actor
export const getActorMovies = async (actorId) => {
  try {
    const res = await axios.get(`${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`)
    return res.data.cast || []
  } catch (error) {
    console.error('Error fetching actor movies:', error)
    return []
  }
}

// ✅ Search by Director
export const searchMoviesByDirector = async (query) => {
  try {
    // Step 1: Search for the person by name
    const personRes = await axios.get(
      `${BASE_URL}/search/person?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
    )
    const matched = personRes.data.results
    if (!matched || matched.length === 0) return []

    // Step 2: Loop over all matches to find movies they directed
    const allDirectedMovies = []

    for (const person of matched) {
      const creditsRes = await axios.get(
        `${BASE_URL}/person/${person.id}/movie_credits?api_key=${API_KEY}`,
      )

      const directed = creditsRes.data.crew?.filter((item) => item.job === 'Director')
      if (directed?.length) {
        allDirectedMovies.push(...directed)
      }
    }

    // Step 3: Deduplicate and return
    const unique = Object.values(
      allDirectedMovies.reduce((acc, movie) => {
        acc[movie.id] = movie
        return acc
      }, {}),
    )

    return unique
  } catch (error) {
    console.error('Error searching movies by director:', error)
    return []
  }
}

// New — Get director suggestions (returns people)
export const searchDirectors = async (query) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/search/person?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
    )
    return res.data.results?.filter((person) => person.known_for_department === 'Directing') || []
  } catch (err) {
    console.error('Error searching directors:', err)
    return []
  }
}

// ✅ Search by Genre (name → ID)
const genreMap = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science fiction': 878,
  scifi: 878,
  'sci-fi': 878,
  'tv movie': 10770,
  tvmovie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
}

export const getGenreSuggestions = (query) => {
  const normalized = query.toLowerCase().trim()
  return Object.keys(genreMap)
    .filter((key) => key.includes(normalized))
    .map((name) => ({
      id: genreMap[name],
      name: name.charAt(0).toUpperCase() + name.slice(1),
    }))
}

export const searchMoviesByGenre = async (query) => {
  try {
    const genreKey = query
      .toLowerCase()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z]/gi, '')
    const genreId = genreMap[genreKey]
    if (!genreId) return []

    const res = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
    )
    return res.data.results
  } catch (error) {
    console.error('Error searching movies by genre:', error)
    return []
  }
}

// ✅ NEW: Fetch all movies (cast + crew) for a person by personId
export const getAllCreditsByPersonId = async (personId) => {
  try {
    const res = await axios.get(`${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}`)
    const castMovies = res.data.cast || []
    const crewMovies = res.data.crew || []
    return { cast: castMovies, crew: crewMovies }
  } catch (err) {
    console.error('Error fetching person credits:', err)
    return { cast: [], crew: [] }
  }
}

// ✅ Get person details by ID (to get profile_path)
export const getPersonDetailsById = async (personId) => {
  try {
    const res = await axios.get(`${BASE_URL}/person/${personId}?api_key=${API_KEY}`)
    return res.data
  } catch (err) {
    console.error('Error fetching person details:', err)
    throw err
  }
}

// Award Winning Movies
const V4_ACCESS_TOKEN = import.meta.env.VITE_TMDB_V4_TOKEN

export const getAwardWinningMovies = async () => {
  try {
    const response = await fetch('https://api.themoviedb.org/4/list/28', {
      headers: {
        Authorization: `Bearer ${V4_ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
    const data = await response.json()
    return data.results // This gives you the movie array
  } catch (err) {
    console.error('Error fetching award-winning movies:', err)
    return []
  }
}

// topRevenueIds.js or inside tmdb.js
export const TOP_REVENUE_MOVIE_IDS = [
  299534, 597, 19995, 447365, 155, 181812, 76341, 424, 102382, 122917, 166428, 671, 278, 680, 122,
  24428, 438631, 315635, 118340, 27205, 157336, 634649, 497698, 603, 497, 1891, 603692, 181808, 120,
  122906,
]

export async function fetchTopBoxOfficeMovies() {
  const requests = TOP_REVENUE_MOVIE_IDS.map(async (id) => {
    const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    return res.data
  })

  const movies = await Promise.all(requests)

  return movies.filter((m) => m.revenue > 0).sort((a, b) => b.revenue - a.revenue) // safety sort
}

// ✅ Fetch movies by genre name (supports multiple pages)
export const getMoviesByGenre = async (genreName, totalPages = 3) => {
  try {
    const genreKey = genreName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '')
      .replace(/[^a-z]/gi, '')
    const genreId = genreMap[genreKey]
    if (!genreId) return []

    let allResults = []

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`,
      )
      allResults.push(...(response.data?.results || []))
    }

    return allResults
  } catch (error) {
    console.error('Error fetching genre movies:', error)
    return []
  }
}

export const getPrimaryGenre = async (movieId) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
    const genres = res.data.genres || []
    if (genres.length > 0) {
      return genres[0].id // ✅ return only the first genre ID
    }
    return null
  } catch (error) {
    console.error(`Error fetching genre for movie ${movieId}:`, error)
    return null
  }
}

// ✅ Get TMDB Genre ID → Name map
export const getGenreMap = async () => {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    const genres = res.data.genres || [] // Array of { id, name }

    const genreMap = {}
    genres.forEach((g) => {
      genreMap[g.id] = g.name
    })

    return genreMap
  } catch (err) {
    console.error('Error fetching genre map:', err)
    return {}
  }
}

// Top Box Office
// export async function fetchTopRevenueMovies(pages = 5) {
//   let allMovies = []

//   for (let i = 1; i <= pages; i++) {
//     const res = await axios.get(
//       `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${i}`,
//     )
//     allMovies = allMovies.concat(res.data.results)
//   }

//   // Fetch revenue for each movie
//   const withRevenue = await Promise.all(
//     allMovies.slice(0, 100).map(async (movie) => {
//       const detailRes = await axios.get(
//         `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`,
//       )
//       return {
//         ...movie,
//         revenue: detailRes.data.revenue || 0,
//       }
//     }),
//   )

//   return withRevenue
//     .filter((m) => m.revenue > 0)
//     .sort((a, b) => b.revenue - a.revenue)
//     .slice(0, 30)
// }
