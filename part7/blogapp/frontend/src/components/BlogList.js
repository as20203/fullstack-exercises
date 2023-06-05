import { useState, useContext } from 'react'
import blogService from '../services/blogs'
import BlogFrom from './BlogForm'
import NotificationContext from '../NotificationContext'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Button, Container } from '../styledComponents'

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
  return (
    <div>
      {toggleNote && <BlogFrom createBlog={createBlog} />}
      <Button
        backgroundColor="green"
        color="white"
        id="blog-form-button"
        onClick={() => setToggleNote((toggleNote) => !toggleNote)}
      >
        {' '}
        {toggleNote ? 'cancel' : 'new blog'}{' '}
      </Button>
      {blogs.data
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Container
            key={blog?.id}
            className="blog"
            padding="10px 0px 0px 2px"
            border="2px solid black"
            margin="10px 0px 5px 0px"
          >
            <Link
              style={{
                color: 'blue',
                paddingRight: '5px',
                textDecoration: 'none',
                padding: '10px',
              }}
              to={`/blogs/${blog?.id}`}
            >
              <span> {blog.title} </span> <span> {blog?.user?.name} </span>
            </Link>
          </Container>
        ))}
    </div>
  )
}

export default BlogList
