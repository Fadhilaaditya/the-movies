import { describe, it, expect } from 'vitest'

describe('formatDate', () => {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  it('formats valid date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
  })

  it('returns empty string for empty date', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(null as any)).toBe('')
  })
})

describe('getYearFromDate', () => {
  const getYear = (dateString: string) => {
    if (!dateString) return null
    return new Date(dateString).getFullYear()
  }

  it('extracts year from date string', () => {
    expect(getYear('2024-06-15')).toBe(2024)
    expect(getYear('2023-12-31')).toBe(2023)
  })

  it('returns null for empty date', () => {
    expect(getYear('')).toBeNull()
    expect(getYear(null as any)).toBeNull()
  })
})

describe('truncateText', () => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  }

  it('truncates long text', () => {
    const longText = 'This is a very long text that should be truncated'
    const result = truncateText(longText, 20)
    expect(result).toBe('This is a very long ...')
    expect(result.length).toBeLessThanOrEqual(23)
  })

  it('returns original text if shorter than max', () => {
    const shortText = 'Short text'
    expect(truncateText(shortText, 50)).toBe('Short text')
  })

  it('returns empty string for empty input', () => {
    expect(truncateText('', 10)).toBe('')
  })
})

describe('ratingToStars', () => {
  const ratingToStars = (rating: number, maxStars = 10) => {
    const stars = Math.round(rating)
    return {
      filled: Math.min(stars, maxStars),
      empty: Math.max(0, maxStars - stars),
    }
  }

  it('converts rating to filled/empty stars', () => {
    expect(ratingToStars(7.5)).toEqual({ filled: 8, empty: 2 })
    expect(ratingToStars(5)).toEqual({ filled: 5, empty: 5 })
  })

  it('caps stars at max value', () => {
    expect(ratingToStars(10)).toEqual({ filled: 10, empty: 0 })
    expect(ratingToStars(11)).toEqual({ filled: 10, empty: 0 })
  })
})
