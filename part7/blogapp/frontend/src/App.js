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
import { Button, Container } from './styledComponents'
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
          <Container
            display="flex"
            background="#dddddd"
            flexDirection="row"
            justifyContent="left"
          >
            <Link
              style={{
                color: 'blue',
                paddingRight: '5px',
                textDecoration: 'none',
                padding: '10px',
              }}
              to="/"
            >
              blogs
            </Link>
            <Link
              style={{
                color: 'blue',
                paddingRight: '5px',
                textDecoration: 'none',
                padding: '10px',
              }}
              to="/users"
            >
              users
            </Link>
            <Container margin="0px 5px 0px 0px" padding="10px">
              {' '}
              {user?.name} logged in{' '}
            </Container>
            <Button padding="10px" onClick={handleLogout}>
              {' '}
              logout{' '}
            </Button>
          </Container>
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
