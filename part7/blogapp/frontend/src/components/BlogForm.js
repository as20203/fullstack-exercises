import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    setBlog((blog) => {
      return { ...blog, [event.target.name]: event.target.value }
    })
  }
  const addBlog = async (event) => {
    try {
      event.preventDefault()
      await createBlog(blog)
      setBlog({ title: '', author: '', url: '' })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form style={{ padding: '20px 0px' }} onSubmit={addBlog}>
      create new:
      <div>
        title:
        <input
          id="title"
          required
          type="text"
          value={blog.title}
          name="title"
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div>
        author:
        <input
          id="author"
          required
          type="text"
          value={blog.author}
          name="author"
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div>
        url:
        <input
          id="url"
          required
          type="text"
          value={blog.url}
          name="url"
          onChange={(event) => handleChange(event)}
        />
      </div>
      <button id="add-blog-button" type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
