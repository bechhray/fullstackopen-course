import { useState, useRef } from 'react'
import Notification from './Notification'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import Blog from './Blog'
import blogService from '../services/blogs'

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

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      returnedBlog.user = updatedBlog.user
      setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      setNotification('Failed to update blog: ' + (exception.response?.data?.error || exception.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id, title) => {
    try {
      if (!window.confirm(`Are you sure you want to delete the blog "${title}"?`)) {
        return
      }
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotification('Blog removed successfully!')
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('Failed to remove blog: ' + (exception.response?.data?.error || exception.message))
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
  const username = user ? user.username : null
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} username={username} />
      )}
    </div>
  )
}

export default BlogList