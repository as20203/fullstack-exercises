import { useState, useContext } from 'react'
import blogService from '../services/blogs'
import BlogFrom from './BlogForm'
import NotificationContext from '../NotificationContext'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const BlogList = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useContext(NotificationContext)
  const [toggleNote, setToggleNote] = useState(false)
  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    },
  })

  const blogs = useQuery('blogs', blogService.getAll)

  const createBlog = async (blog) => {
    try {
      newBlogMutation.mutate(blog)
      dispatch({
        type: 'info',
        text: `a new blog ${blog.title} by ${blog.author} added`,
      })
      setTimeout(() => {
        dispatch({ type: 'clear', text: '' })
      }, 5000)
    } catch {
      dispatch({ type: 'error', text: 'Failed to add blog.' })
      setTimeout(() => {
        dispatch({ type: 'clear', text: '' })
      }, 5000)
    }
  }

  if (blogs.isLoading) {
    return <div>loading data...</div>
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      {toggleNote && <BlogFrom createBlog={createBlog} />}
      <button
        id="blog-form-button"
        onClick={() => setToggleNote((toggleNote) => !toggleNote)}
      >
        {' '}
        {toggleNote ? 'cancel' : 'new blog'}{' '}
      </button>
      {blogs.data
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div key={blog?.id} className="blog" style={blogStyle}>
            <Link to={`/blogs/${blog?.id}`}>
              <span id="blog-title"> {blog.title} </span>{' '}
              <span id="blog-creator"> {blog?.user?.name} </span>
            </Link>
          </div>
        ))}
    </div>
  )
}

export default BlogList
