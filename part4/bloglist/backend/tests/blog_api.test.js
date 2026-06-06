const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)




beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('saved')
})

test('blogs are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map(r => r.id)

  for (const id of ids) {
    assert.ok(id)
  }
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('Coconut chicken tenders with spinach and rice'))
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'New Blog Title',
    author: 'Author Name',
    url: 'https://www.example.com/new-blog',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  assert(titles.includes('New Blog Title'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Author Name',
    url: 'https://www.example.com/new-blog',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    author: 'Author Name',
    title: 'New Blog Title',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'New Blog without likes',
    author: 'Author Name',
    url: 'https://www.example.com/new-blog'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})



after(async () => {
  await mongoose.connection.close()
})
