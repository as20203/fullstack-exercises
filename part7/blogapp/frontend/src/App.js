import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Login from './components/Login'
import blogService from './services/blogs'
const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  useEffect(() => {
    const user = localStorage.getItem('loggedBlogappUser')
    if (user) {
      const loggedInUser = JSON.parse(user)
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
    }
  }, [])
  return (
    <>
      {!user ? (
        <div>
          <h1>log in to application</h1>
          <Login
            notification={notification}
            setNotification={setNotification}
            setUser={setUser}
          />
        </div>
      ) : (
        <BlogList
          notification={notification}
          setNotification={setNotification}
          user={user}
          setUser={setUser}
        />
      )}
    </>
  )
}

export default App
