import { useState } from 'react'

const LoginForm = ({DoLogin}) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('') 

    const handleLogin = async event => {
      event.preventDefault()
      console.log('logging in with', username, password)
      await DoLogin(username, password)
      setUsername('')
      setPassword('')
    }
  
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}
export default LoginForm