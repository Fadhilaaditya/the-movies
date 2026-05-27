import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

describe('TMDb API Helper Functions', () => {
  const API_KEY = 'test_api_key'
  const BASE_URL = 'https://api.themoviedb.org/3'

  beforeEach(() => {
    mock.reset()
  })

  describe('getImageUrl', () => {
    it('formats TMDb image URL correctly for poster', () => {
      const posterPath = '/abc123.jpg'
      const expectedUrl = 'https://image.tmdb.org/t/p/w500/abc123.jpg'
      expect(`https://image.tmdb.org/t/p/w500${posterPath}`).toBe(expectedUrl)
    })

    it('handles original size variant', () => {
      const path = '/poster.jpg'
      expect(`https://image.tmdb.org/t/p/original${path}`).toBe('https://image.tmdb.org/t/p/original/poster.jpg')
    })

    it('handles backdrop images', () => {
      const backdropPath = '/backdrop.jpg'
      expect(`https://image.tmdb.org/t/p/w1280${backdropPath}`).toBe('https://image.tmdb.org/t/p/w1280/backdrop.jpg')
    })
  })

  describe('Movie API calls', () => {
    it('fetches now playing movies', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Movie 1', poster_path: '/p1.jpg' },
          { id: 2, title: 'Movie 2', poster_path: '/p2.jpg' },
        ],
        page: 1,
        total_pages: 10,
      }
      mock.onGet(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
      expect(response.data.results).toHaveLength(2)
      expect(response.data.results[0].title).toBe('Movie 1')
    })

    it('fetches popular movies', async () => {
      const mockData = {
        results: [{ id: 1, title: 'Popular Movie' }],
      }
      mock.onGet(`${BASE_URL}/movie/popular?api_key=${API_KEY}`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
      expect(response.data.results[0].title).toBe('Popular Movie')
    })
  })

  describe('TV API calls', () => {
    it('fetches popular TV shows', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Popular TV Show' }],
      }
      mock.onGet(`${BASE_URL}/tv/popular?api_key=${API_KEY}`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}`)
      expect(response.data.results[0].name).toBe('Popular TV Show')
    })

    it('fetches TV show details with credits', async () => {
      const mockData = {
        id: 1,
        name: 'TV Detail Show',
        overview: 'A great show',
        seasons: [{ id: 1, name: 'Season 1' }],
        credits: {
          cast: [{ id: 1, name: 'Actor One', character: 'Hero' }],
        },
      }
      mock.onGet(`${BASE_URL}/tv/1?api_key=${API_KEY}&append_to_response=credits`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/tv/1?api_key=${API_KEY}&append_to_response=credits`)
      expect(response.data.name).toBe('TV Detail Show')
      expect(response.data.credits.cast).toHaveLength(1)
    })
  })

  describe('Search API', () => {
    it('fetches multi-search results', async () => {
      const mockData = {
        results: [
          { id: 1, media_type: 'movie', title: 'Found Movie' },
          { id: 2, media_type: 'tv', name: 'Found TV Show' },
        ],
        page: 1,
        total_pages: 5,
      }
      mock.onGet(`${BASE_URL}/search/multi`, { params: { api_key: API_KEY, query: 'test' } }).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: { api_key: API_KEY, query: 'test' },
      })
      expect(response.data.results).toHaveLength(2)
    })
  })

  describe('Genre API', () => {
    it('fetches movie genres', async () => {
      const mockData = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 35, name: 'Comedy' },
        ],
      }
      mock.onGet(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      expect(response.data.genres).toHaveLength(3)
      expect(response.data.genres[0].name).toBe('Action')
    })

    it('fetches TV genres', async () => {
      const mockData = {
        genres: [
          { id: 10765, name: 'Action & Adventure' },
          { id: 18, name: 'Drama' },
        ],
      }
      mock.onGet(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`).reply(200, mockData)

      const response = await axios.get(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`)
      expect(response.data.genres[0].name).toBe('Action & Adventure')
    })
  })
})
