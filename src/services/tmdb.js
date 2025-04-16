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
