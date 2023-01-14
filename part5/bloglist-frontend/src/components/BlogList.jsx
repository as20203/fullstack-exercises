import { useState, useEffect } from 'react';
import Blog from './Blog'
import blogService from '../services/blogs'
import AddBlog from './AddBlog';
import Notification from './Notification/Notification';
const BlogList = ({ user, setUser, notification, setNotification }) => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true);
    const getBlogs = async () => {
        try {
            const blogs = await blogService.getAll()
            setBlogs(blogs)
            setLoading(false);
        } catch {
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
                <AddBlog setBlogs={setBlogs} setNotification={setNotification} />
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </div>}
        </>
    )
}

export default BlogList