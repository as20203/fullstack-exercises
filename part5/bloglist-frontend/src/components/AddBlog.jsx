import { useState } from 'react';
import blogService from '../services/blogs';
const AddBlog = ({ setBlogs, setNotification }) => {
    const [blog, setBlog] = useState({ title: '', author: '', url: '' });

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const newBlog = await blogService.create(blog);
            
            setBlog({ title: '', author: '', url: '' })
            setNotification({ type: 'info', text: `a new blog ${newBlog.title} by ${newBlog.author} added`})
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

    const handleChange = (event) => {
        setBlog(blog => {
            return { ...blog, [event.target.name]: event.target.value }
        })
    }
    return <form style={{ padding: '20px 0px' }} onSubmit={handleSubmit}>
        create new:
        <div>
            title:
            <input
                required
                type="text"
                value={blog.title}
                name="title"
                onChange={event => handleChange(event)}
            />
        </div>
        <div>
            author:
            <input
                required
                type="text"
                value={blog.author}
                name="author"
                onChange={event => handleChange(event)}
            />
        </div>
        <div>
            url:
            <input
                required
                type="text"
                value={blog.url}
                name="url"
                onChange={event => handleChange(event)}
            />
        </div>
        <button type="submit">create</button>
    </form>
}

export default AddBlog;