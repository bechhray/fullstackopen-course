const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'test', url: 'https://www.example.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}