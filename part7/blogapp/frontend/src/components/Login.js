import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'
import Notification from './Notification/Notification'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import userContext from '../UserContext'
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, dispatch] = useContext(NotificationContext)
  const [, userDispatch] = useContext(userContext)
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      setUsername('')
      setPassword('')
      localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userService.setToken(user.token)
      userDispatch({ type: 'LOGGED_IN', data: user })
    } catch (exception) {
      dispatch({ type: 'error', text: 'Wrong username or passsword.' })
      setTimeout(() => {
        dispatch({ type: 'clear', text: '' })
      }, 5000)
    }
  }
  return (
    <>
      <h1>log in to application</h1>
      {notification && <Notification message={notification} />}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </>
  )
}

export default Login
