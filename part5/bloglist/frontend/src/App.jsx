import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import Blog from './components/Blog'

import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
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
      }, 3000)
      window.location.href = '/'
    } catch (exception) {
      setNotification('Failed to remove blog: ' + (exception.response?.data?.error || exception.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const padding = {
    padding: 5
  }
  const username = user ? user.username : null

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        { user && <Link style={padding} to="/create">new blog</Link> }
        {user
          ? <button onClick={handleLogout}>logout</button>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>
      <Routes>
        <Route path="/blogs/:id" element={
          <>
            <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} username={username}/>
          </>
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} setBlogs={setBlogs} user={user} />
        } />
        <Route path="/create" element={
          <CreateBlog setNotification={setNotification} setNotificationType={setNotificationType} setBlogs={setBlogs} blogs={blogs} user={user} />
        } />
        <Route path="/login" element={
          <Login user={user} setUser={setUser} />
        } />
      </Routes>
    </div>
  )
}

export default App