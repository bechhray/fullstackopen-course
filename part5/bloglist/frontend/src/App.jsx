import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const DoLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      setNotification(`Logged in successfully! Welcome ${user.name}!`)
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log('logged in user:', user)
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log('wrong credentials')
      setNotification('Wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.error(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('Logged out successfully!')
    setNotificationType('success')
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

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
      {!user && (
        <div>
        <h2>log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <LoginForm DoLogin={DoLogin}/>
        </div>
      )}
      {user && (
        <div>
        <h2>blogs</h2>
        <Notification message={notification} type={notificationType} />
        <span>{user.name} logged in</span> <button onClick={handleLogout}>logout</button>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )}
    </div>
  )
}

export default App