import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.*/)
  })

  test('shows navigation bar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('THE MOVIES')).toBeVisible()
    await expect(page.getByRole('link', { name: /movies/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /tv series/i })).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /movies/i }).click()
    await expect(page).toHaveURL(/\/Movie/)
  })

  test('TV series link works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /tv series/i }).click()
    await expect(page).toHaveURL(/\/Tv/)
  })
})

test.describe('Movie Listing Page', () => {
  test('loads movie page', async ({ page }) => {
    await page.goto('/Movie')
    await expect(page.getByText('Featured Movies')).toBeVisible()
  })

  test('shows movie cards', async ({ page }) => {
    await page.goto('/Movie')
    await page.waitForSelector('img', { timeout: 10000 })
    const images = page.locator('img')
    expect(await images.count()).toBeGreaterThan(0)
  })
})

test.describe('Search Functionality', () => {
  test('search bar is present in navbar', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()
  })

  test('search navigation works', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('Batman')
    await searchInput.press('Enter')
    await expect(page).toHaveURL(/Search\?q=Batman/)
  })
})
