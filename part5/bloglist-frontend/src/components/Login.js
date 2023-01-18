import { useState } from 'react';
import loginService from '../services/login'
import blogService from '../services/blogs';
import Notification from './Notification/Notification';
import PropTypes from 'prop-types'

const Login = ({ setUser, notification, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token);
    } catch (exception) {
      setNotification({ type: 'error', text: 'Wrong username or passsword.' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  return <>
    {
      notification &&
            <Notification message={notification} />
    }
    <form onSubmit={handleLogin}>
      <div>
                username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
                password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </>

}
Login.propTypes = {
  setUser: PropTypes.func.isRequired,
  notification: PropTypes.object,
  setNotification: PropTypes.func.isRequired,
}

export default Login;