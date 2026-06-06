const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Coconut chicken tenders with spinach and rice',
    author: 'Kerrie Ray',
    url: 'https://www.healthyfood.com/healthy-recipes/coconut-chicken-tenders-with-spinach-and-rice/',
    likes: 0
  },
  {
    title: 'Mushroom and haloumi burgers',
    author: 'Chrissy Freer',
    url: 'https://www.healthyfood.com/healthy-recipes/mushroom-and-haloumi-burgers/',
    likes: 5
  },
  {
    title: 'Warm baked feta and squash salad',
    author: 'HFG staff',
    url: 'https://www.healthyfood.com/healthy-recipes/warm-baked-feta-and-squash-salad/',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
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

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

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

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
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

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
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
