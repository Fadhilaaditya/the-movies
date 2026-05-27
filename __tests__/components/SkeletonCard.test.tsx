import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SkeletonCard from '@/app/components/ui/SkeletonCard'

describe('SkeletonCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.firstChild).toBeTruthy()
  })

  it('has rounded container', () => {
    const { container } = render(<SkeletonCard />)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('rounded-2xl')
  })

  it('has shimmer animation class', () => {
    const { container } = render(<SkeletonCard />)
    const innerDiv = container.querySelector('.animate-shimmer')
    expect(innerDiv).toBeTruthy()
  })
})
