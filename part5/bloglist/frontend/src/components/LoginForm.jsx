import { useState } from 'react'
import { TextField, Button } from '@mui/material'


const LoginForm = ({ doLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)
    await doLogin(username, password)
    setUsername('')
    setPassword('')
  }
  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <div>
        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }}>login</Button>
    </form>
  )
}
export default LoginForm