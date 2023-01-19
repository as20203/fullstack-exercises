import { useState } from 'react';
import blogService from '../services/blogs';
const Blog = ({ blog, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false);
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedBlogappUser'));
      console.log({ user })
      return user?.id;
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }

  const handleLikes = async () => {
    try {
      const { id, ...updatedBlog } = blog;
      const newBlogLikes = blog.likes + 1;
      setBlogs(blogs => {
        const updatedBlogs = [...blogs];
        const updatedBlogIndex = updatedBlogs.findIndex(({ id }) => blog.id === id);
        if (updatedBlogIndex !== -1)
          updatedBlogs[updatedBlogIndex] = { ...updatedBlogs[updatedBlogIndex], likes: newBlogLikes }
        return updatedBlogs;
      })
      const updatedBlogPost = { ...updatedBlog, likes: newBlogLikes }
      await blogService.update(id, updatedBlogPost)

      // eslint-disable-next-line no-empty
    } catch (error) { }
  }

  const handleDelete = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs => {
          const updatedBlogs = [...blogs];
          const removedBlogIndex = updatedBlogs.findIndex(({ id }) => blog.id === id);
          if (removedBlogIndex !== -1) {
            updatedBlogs.splice(removedBlogIndex, 1)
          }
          console.log({ blogs });
          return updatedBlogs;
        })
      }

      // eslint-disable-next-line no-empty
    } catch (error) { }
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return <div className='blog' style={blogStyle}>
    <span id="blog-title"> {blog.title} </span> <span id="blog-creator"> {blog?.user?.name} </span>
    <button className='showDetailsButton' onClick={() => setShowDetails(showDetails => !showDetails)} style={{ display: 'inline', marginLeft: '5px' }}> {showDetails ? 'hide' : 'view'} </button>
    {showDetails && <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className='blogUrl'> {blog?.url} </div>
      <span className='blogLikes'>likes {blog.likes}   <button className='blogLikesButton' onClick={() => handleLikes()}> like </button></span>
      {blog?.author}
      <div>
        {getUserId() === blog?.user?.id && <button onClick={() => handleDelete()}> remove </button>}
      </div>
    </div>}
  </div>
}



export default Blog