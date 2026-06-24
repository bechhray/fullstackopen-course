import blogService from '../services/blogs'
import BlogForm from './BlogForm'
import { useNavigate } from 'react-router-dom'

const CreateBlog = ({ setBlogs, blogs, user, setNotification }) => {
  const navigate = useNavigate()

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ text: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 3000)
      navigate('/')
    } catch (exception) {
      setNotification({ text: 'Failed to create blog: ' + (exception.response?.data?.error || exception.message), type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <BlogForm createBlog={createBlog}/>
    </div>
  )
}

export default CreateBlog