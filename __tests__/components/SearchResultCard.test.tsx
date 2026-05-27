import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchResultCard from '@/app/components/ui/SearchResultCard'

describe('SearchResultCard', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    vote_average: 7.5,
    media_type: 'movie' as const,
  }

  const mockTvShow = {
    id: 2,
    name: 'Test TV Show',
    poster_path: '/tv.jpg',
    vote_average: 8.0,
    media_type: 'tv' as const,
  }

  it('renders movie card correctly', () => {
    render(<SearchResultCard item={mockMovie} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('shows media type badge', () => {
    render(<SearchResultCard item={mockMovie} />)
    expect(screen.getByText('movie')).toBeInTheDocument()
  })

  it('shows rating', () => {
    render(<SearchResultCard item={mockMovie} />)
    expect(screen.getByText('7.5')).toBeInTheDocument()
  })

  it('renders tv show with name instead of title', () => {
    render(<SearchResultCard item={mockTvShow} />)
    expect(screen.getByText('Test TV Show')).toBeInTheDocument()
    expect(screen.getByText('tv')).toBeInTheDocument()
  })

  it('handles missing poster gracefully', () => {
    const noPosterMovie = { ...mockMovie, poster_path: null }
    render(<SearchResultCard item={noPosterMovie} />)
    expect(screen.getByText('No image')).toBeInTheDocument()
  })

  it('shows N/A when rating is missing', () => {
    const noRatingMovie = { ...mockMovie, vote_average: null }
    render(<SearchResultCard item={noRatingMovie} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('links to correct route for movie', () => {
    const { container } = render(<SearchResultCard item={mockMovie} />)
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/Movie/1')
  })

  it('links to correct route for tv', () => {
    const { container } = render(<SearchResultCard item={mockTvShow} />)
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/Tv/2')
  })
})
