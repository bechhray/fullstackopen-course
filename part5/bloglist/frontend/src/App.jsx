import { useState, useEffect } from 'react'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'


import blogService from './services/blogs'
import BlogList from './components/BlogList'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import Blog from './components/Blog'
import Notification from './components/Notification'

import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

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
      setNotification({ text: 'Failed to update blog: ' + (exception.response?.data?.error || exception.message), type: 'error' })
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
      setNotification({ text: 'Blog removed successfully!', type: 'success' })
      setTimeout(() => setNotification(null), 3000)
      navigate('/')
    } catch (exception) {
      setNotification({ text: 'Failed to remove blog: ' + (exception.response?.data?.error || exception.message), type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  const username = user ? user.username : null

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null
  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={{ ...hoverStyle, flexGrow: 1, justifyContent: 'flex-start' }}>Blog App</Button>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>}
          {user
            ? <Button color="inherit" component={Link} sx={hoverStyle} onClick={handleLogout}>logout</Button>
            : <Button color="inherit" component={Link} sx={hoverStyle} to="/login">login</Button>
          }
        </Toolbar>
      </AppBar>
      <Notification notification={notification} />
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
          <CreateBlog setNotification={setNotification} setBlogs={setBlogs} blogs={blogs} user={user} />
        } />
        <Route path="/login" element={
          <Login user={user} setUser={setUser} setNotification={setNotification} />
        } />
      </Routes>
    </Container>
  )
}

export default App