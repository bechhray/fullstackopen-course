import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import LoginForm from './LoginForm'

const Login = ({ user, setUser }) => {

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const doLogin = async (username, password) => {
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
        window.location.href = '/'
      }, 3000)
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setNotification('Wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={notification} type={notificationType} />
      <LoginForm doLogin={doLogin}/>
    </div>
  )
}

export default Login