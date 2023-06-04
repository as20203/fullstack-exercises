import { useEffect, useContext } from 'react'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Users from './components/Users'
import blogService from './services/blogs'
import userService from './services/users'
import userContext from './UserContext'
import NotificationContext from './NotificationContext'
import Notification from './components/Notification/Notification'
import UserBlogs from './components/UserBlogs'
import Blog from './components/Blog'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
const App = () => {
  const [user, dispatch] = useContext(userContext)
  const [notification] = useContext(NotificationContext)
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch({ type: 'clear', data: null })
    localStorage.clear()
    navigate('/')
  }
  useEffect(() => {
    const user = localStorage.getItem('loggedBlogappUser')
    if (user) {
      const loggedInUser = JSON.parse(user)
      blogService.setToken(loggedInUser.token)
      userService.setToken(loggedInUser.token)
      dispatch({ type: 'LOGGED_IN', data: loggedInUser })
    }
  }, [dispatch])
  return (
    <>
      {user && (
        <>
          <div
            className="blogsList"
            style={{
              display: 'flex',
              background: 'grey',
              flexDirection: 'row',
              justifyContent: 'left',
            }}
          >
            <Link style={{ paddingRight: '5px' }} to="/">
              blogs
            </Link>
            <Link style={{ paddingRight: '5px' }} to="/users">
              users
            </Link>
            <div style={{ marginRight: '5px' }}> {user?.name} logged in </div>
            <button onClick={handleLogout}> logout </button>
          </div>
          <h2>Blog app</h2>
          {notification && <Notification message={notification} />}
        </>
      )}
      <Routes>
        <Route path="/" element={!user ? <Login /> : <BlogList />} />
        <Route path="/users" element={<Users user={user} />} />
        <Route path="/users/:id" element={<UserBlogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </>
  )
}

export default App
