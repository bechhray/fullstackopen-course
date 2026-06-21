
import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByText('log in to application')
    await expect(loginForm).toBeVisible()
  })
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.request.post('http://localhost:3001/api/testing/reset')
      await page.request.post('http://localhost:3001/api/users', {
        data: {
          username: 'rbech',
          name: 'Rayene Bech',
          password: 'salainen'
        }
      })
      await page.goto('http://localhost:5173')
    })
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('rbech')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      const welcomeMessage = page.getByText('Logged in successfully! Welcome Rayene Bech!')
      await expect(welcomeMessage).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('rbech')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      const errorMessage = page.getByText('Wrong username or password')
      await expect(errorMessage).toBeVisible()
    })
  })
  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('rbech')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

  })
})

