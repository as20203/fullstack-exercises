import { useState, useEffect } from 'react';
import Blog from './Blog'
import blogService from '../services/blogs'
import BlogFrom from './BlogForm';
import Notification from './Notification/Notification';
const BlogList = ({ user, setUser, notification, setNotification }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true);
  const [toggleNote, setToggleNote] = useState(false);



  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)

      setNotification({ type: 'info', text: `a new blog ${newBlog.title} by ${newBlog.author} added` })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch {
      setNotification({ type: 'error', text: 'Failed to add blog.' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }


  const getBlogs = async () => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  }
  useEffect(() => {
    getBlogs()
  }, [])

  return (
    <>
      {!loading && <div>
        <h2>blogs</h2>
        {
          notification &&
                    <Notification message={notification} />
        }

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ marginRight: '5px' }} > {user.name} logged in  </div>
          <button onClick={handleLogout}> logout </button></div>
        {toggleNote && <BlogFrom createBlog={createBlog} />}
        <button onClick={() => setToggleNote(toggleNote => !toggleNote)}> {toggleNote ? 'cancel' : 'new note'} </button>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog setBlogs={setBlogs} key={blog.id} blog={blog} />
        )}
      </div>}
    </>
  )
}

export default BlogList