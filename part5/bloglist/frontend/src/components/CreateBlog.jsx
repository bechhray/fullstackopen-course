import blogService from '../services/blogs'
import BlogForm from './BlogForm'
import Notification from './Notification'

import { useState } from 'react'

const CreateBlog = ({setBlogs, blogs, user }) => {
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
        window.location.href = '/'
      }, 3000)
    } catch (exception) {
      setNotification('Failed to create blog: ' + (exception.response?.data?.error || exception.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <Notification message={notification} type={notificationType} />
      <BlogForm createBlog={createBlog}/>
    </div>
  )
}

export default CreateBlog