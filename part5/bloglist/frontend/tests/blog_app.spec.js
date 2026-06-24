
import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
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

    test('Login link is shown in the header', async ({ page }) => {
      const loginForm = page.getByRole('link', { name: 'login' })
      await expect(loginForm).toBeVisible()
    })

    test('Login succeeds with the correct username/password combination', async ({ page }) => {
      await loginWith(page, 'rbech', 'salainen')
      const welcomeMessage = page.getByText('Logged in successfully! Welcome Rayene Bech!')
      await expect(welcomeMessage).toBeVisible()
    })

    test('Login fails if the username/password is incorrect', async ({ page }) => {
      await loginWith(page, 'rbech', 'wrongpassword')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Logged in successfully! Welcome Rayene Bech!')).not.toBeVisible()
    })

    test.describe('When logged in', () => {
      test.beforeEach(async ({ page }) => {
        await page.request.post('/api/testing/reset')
        await page.request.post('/api/users', {
          data: {
            username: 'rbech',
            name: 'Rayene Bech',
            password: 'salainen'
          }
        })
        await loginWith(page, 'rbech', 'salainen')
        await page.getByRole('link', { name: 'new blog' }).waitFor()
      })

      test('A logged-in user can create a blog', async ({ page }) => {
        await createBlog(page, 'Testing Creating a new blog', 'Rayene Bech', 'http://example.com')
        // notification appears on the /create page after submission
        const notification = page.getByText('A new blog "Testing Creating a new blog" by Rayene Bech added')
        await expect(notification).toBeVisible()
        // after 3 seconds the app redirects to the home page
        await page.getByRole('heading', { name: 'blogs', level: 2 }).waitFor()
        const newBlog = page.getByText('Testing Creating a new blog by Rayene Bech')
        await expect(newBlog).toBeVisible()
      })

      test.describe('and a blog exists', () => {
        test.beforeEach(async ({ page }) => {
          await createBlog(page, 'Existing Blog', 'Rayene Bech', 'http://example.com')
          await createBlog(page, 'Another Blog', 'Rayene Bech', 'http://example.com')
        })

        test('A logged-in user can like a blog', async ({ page }) => {
          await page.getByText('Existing Blog by Rayene Bech').click()
          await page.getByText('Rayene Bech: Existing Blog').waitFor()
          await page.getByRole('button', { name: 'like' }).click()
          const likes = page.getByText('1 likes')
          await expect(likes).toBeVisible()
        })

        test('A logged-in user can remove a blog they created', async ({ page }) => {
          await page.getByText('Existing Blog by Rayene Bech').click()
          await page.getByText('Rayene Bech: Existing Blog').waitFor()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()
          await page.goto('/')
          await expect(page.getByText('Existing Blog by Rayene Bech')).not.toBeVisible()
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
          await page.getByText('Another Blog by Rayene Bech').click()
          await page.getByText('Rayene Bech: Another Blog').waitFor()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })
    })
  })
})


//     test('Blogs are ordered according to likes', async ({ page }) => {
//       await page.getByText('Existing Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()
//       await page.getByText('Another Blog By Rayene Bech').getByRole('button', { name: 'view' }).click()

//       const likeButtons = page.getByRole('button', { name: 'like' })
//       await likeButtons.nth(1).click()
//       await likeButtons.nth(1).click()

//       await likeButtons.nth(0).click()

//       const blogs = page.locator('.blog')
//       await expect(blogs.nth(0)).toContainText('Another Blog By Rayene Bech')
//       await expect(blogs.nth(1)).toContainText('Existing Blog By Rayene Bech')
//     })
//   })
// })