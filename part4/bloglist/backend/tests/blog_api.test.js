const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
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
})

describe('addition of a new blog', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJiZWNoIiwiaWQiOiI2YTI1MGZiNWFkNDBlYzAwMjVlNDNmMzgiLCJpYXQiOjE3ODA5NDc4MDAsImV4cCI6MTc4MDk1MTQwMH0.XQIUJuMa5CdGmVfCHzlkkWSYE-dgqYP-n4nHD-43KQA'
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'New Blog Title',
      author: 'Author Name',
      url: 'https://www.example.com/new-blog',
      likes: 0
    }
    const loginResponse = await api.post('/api/login').send({ username: 'rbech', password: 'salainen' })
    const token = loginResponse.body.token
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert(titles.includes('New Blog Title'))
  })

  test('blog without title is not added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      author: 'Author Name',
      url: 'https://www.example.com/new-blog',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', validToken)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('blog without url is not added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      author: 'Author Name',
      title: 'New Blog Title',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', validToken)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'New Blog without likes',
      author: 'Author Name',
      url: 'https://www.example.com/new-blog'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', validToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
})

describe('deletion of a blog', () => {
  const nonValidToken = 'Bearer nonvalidtoken'
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJiZWNoIiwiaWQiOiI2YTI1MGZiNWFkNDBlYzAwMjVlNDNmMzgiLCJpYXQiOjE3ODA5NDc4MDAsImV4cCI6MTc4MDk1MTQwMH0.XQIUJuMa5CdGmVfCHzlkkWSYE-dgqYP-n4nHD-43KQA'

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', validToken)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 404 if id does not exist', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlogData = {
      title: 'Updated Blog Title',
      author: 'Updated Author',
      url: 'http://updatedurl.com',
      likes: 9
    }
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedBlogData.title)
    assert.strictEqual(response.body.author, updatedBlogData.author)
    assert.strictEqual(response.body.url, updatedBlogData.url)
    assert.strictEqual(response.body.likes, updatedBlogData.likes)
  })

  test('fails with status code 404 if id does not exist', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validNonexistingId = await helper.nonExistingId()
    const updatedBlogData = {
      title: 'Updated Blog Title',
      author: 'Updated Author',
      url: 'http://updatedurl.com',
      likes: 9
    }
    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(updatedBlogData)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
