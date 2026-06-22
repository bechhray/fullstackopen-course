import { useState, useRef } from 'react'
import Notification from './Notification'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import Blog from './Blog'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, setBlogs, user }) => {
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const blogFormRef = useRef()

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('Failed to create blog: ' + (exception.response?.data?.error || exception.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog}/>
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      {blogForm()}
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList