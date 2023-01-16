import { useState } from "react";
import blogService from "../services/blogs";
const Blog = ({blog, setBlogs }) =>  {
  const [showDetails, setShowDetails] = useState(false);
  const [blogLikes, handleBlogLikes] = useState(blog.likes);
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedBlogappUser'));
      console.log({ user })
      return user?.id;
    } catch {}
  }


  const handleLikes = async () => {
    try {
      const {id, ...updatedBlog  } = blog;
      const newBlogLikes = blogLikes + 1;
      handleBlogLikes(blogLikes => blogLikes + 1)
      const updatedBlogPost= { ...updatedBlog, likes: newBlogLikes } 
      await blogService.update(id, updatedBlogPost)

    } catch {

    }
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

    } catch {

    }
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return <div style={blogStyle}>
  {blog.title} 
  <button onClick={() => setShowDetails(showDetails => !showDetails)} style={{display: 'inline', marginLeft: '5px' }}> {showDetails ? 'hide' : 'view'} </button>
  {showDetails && <div style={{ display: 'flex', flexDirection: 'column' }}>
  {blog?.url}
  <span>likes {blogLikes}   <button onClick={() => handleLikes()}> like </button></span>
  {blog?.author}
  <div>
  {getUserId() === blog?.user?.id &&<button onClick={() => handleDelete()}> remove </button> }
  </div>
  </div>}
</div>  
}
  


export default Blog