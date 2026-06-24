import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').waitFor()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').waitFor()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const openBlogFromList = async (page, blogText) => {
  const blogLink = page.getByRole('link', { name: blogText })
  await expect(blogLink).toBeVisible()
  const href = await blogLink.getAttribute('href')
  await page.goto(href)
}

export { loginWith, createBlog, openBlogFromList }