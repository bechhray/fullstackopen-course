
import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByText('log in to application')
    await expect(loginForm).toBeVisible()
  })
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.request.post('/api/testing/reset')
      await page.request.post('/api/users', {
        data: {
          username: 'rbech',
          name: 'Rayene Bech',
          password: 'salainen'
        }
      })
      await page.goto('/')
    })
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'rbech', 'salainen')
      const welcomeMessage = page.getByText('Logged in successfully! Welcome Rayene Bech!')
      await expect(welcomeMessage).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'rbech', 'wrongpassword')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Logged in successfully! Welcome Rayene Bech!')).not.toBeVisible()

    })
  })
  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.request.post('/api/testing/reset')
      await page.request.post('/api/users', {
        data: {
          username: 'rbech',
          name: 'Rayene Bech',
          password: 'salainen'
        }
      })
      await page.goto('/')
      await loginWith(page, 'rbech', 'salainen')
      await page.getByRole('button', { name: 'new blog' }).waitFor()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing with Playwright', 'Rayene Bech', 'http://example.com')
      const newBlog = page.getByText('Testing with Playwright By Rayene Bech')
      await expect(newBlog).toBeVisible()
    })

    test.describe('and a blog exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, 'Existing Blog', 'Rayene Bech', 'http://example.com')
        await createBlog(page, 'Another Blog', 'Rayene Bech', 'http://example.com')
      })

      test('A blog can be liked', async ({ page }) => {
        await page.getByText('Existing Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        const likes = page.getByText('1 likes')
        await expect(likes).toBeVisible()
      })
      test('A blog can be removed by the creator', async ({ page }) => {
        await page.getByText('Existing Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Existing Blog By Rayene Bech')).not.toBeVisible()
      })

      test('A blog cannot be removed by another user', async ({ page }) => {
        await page.request.post('/api/users', {
          data: {
            username: 'otheruser',
            name: 'Other User',
            password: 'password'
          }
        })
        await page.goto('/')
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'otheruser', 'password')
        await page.getByText('Another Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('Blogs are ordered according to likes', async ({ page }) => {
        await page.getByText('Existing Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()
        await page.getByText('Another Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()

        const likeButtons = page.getByRole('button', { name: 'like' })
        await likeButtons.nth(1).click()
        await likeButtons.nth(1).click()

        await likeButtons.nth(0).click()

        const blogs = page.locator('.blog')
        await expect(blogs.nth(0)).toContainText('Another Blog By Rayene Bech')
        await expect(blogs.nth(1)).toContainText('Existing Blog By Rayene Bech')
      })
    })
  })
})