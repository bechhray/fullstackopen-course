import loginService from '../services/login'
import blogService from '../services/blogs'
import LoginForm from './LoginForm'
import { useNavigate } from 'react-router-dom'

const Login = ({ user, setUser, setNotification }) => {
  const navigate = useNavigate()

  const doLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setNotification({ text: `Logged in successfully! Welcome ${user.name}!`, type: 'success' })
      setTimeout(() => setNotification(null), 3000)
      navigate('/')
    } catch {
      setNotification({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <LoginForm doLogin={doLogin}/>
    </div>
  )
}

export default Login