import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useState } from 'react'
const Blog = () => {
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const id = useParams().id
  const navigate = useNavigate()

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess: (deletedBlogId) => {
      const blogs = queryClient.getQueryData('blogs')

      const updatedBlogs = [...blogs]
      const removedBlogIndex = updatedBlogs.findIndex(
        ({ id }) => deletedBlogId === id
      )
      if (removedBlogIndex !== -1) {
        updatedBlogs.splice(removedBlogIndex, 1)
      }
      queryClient.setQueryData('blogs', updatedBlogs)
    },
  })

  const blogQuery = useQuery(['blogs', id], blogService.getBlog)
  const blogCommentQuery = useQuery(
    ['blogComments', id],
    blogService.getBlogComments
  )

  const createBlogCommentMutation = useMutation(blogService.addBlogComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogComments')
    },
  })

  if (blogQuery.isLoading || blogCommentQuery.isLoading) {
    return <div>loading data...</div>
  }
  const comments = blogCommentQuery.data
  const blog = blogQuery.data

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedBlogappUser'))
      return user?.id
    } catch (error) {}
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('came here', comment)
    createBlogCommentMutation.mutate({ id: blog?.id, text: comment })
  }

  const handleLikes = async () => {
    try {
      const newBlogLikes = blog.likes + 1
      const updatedBlogPost = { ...blog, likes: newBlogLikes }
      updateBlogMutation.mutate(updatedBlogPost)
    } catch (error) {}
  }

  const handleDelete = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        deleteBlogMutation.mutate(blog.id)
        navigate('/')
      }

      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  const blogStyle = {
    fontWeight: 'bold',
  }
  return (
    <div className="blog">
      <div style={blogStyle}>
        <span id="blog-title"> {blog?.title} </span>{' '}
        <span id="blog-creator"> {blog?.user?.name} </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={blog?.url} className="blogUrl">
          {' '}
          {blog?.url}{' '}
        </Link>
        <span className="blogLikes">
          likes {blog.likes}{' '}
          <button className="blogLikesButton" onClick={() => handleLikes()}>
            {' '}
            like{' '}
          </button>
        </span>
        {blog?.author && `added by ${blog?.author}`}
        <div>
          {getUserId() === blog?.user?.id && (
            <button onClick={() => handleDelete()}> remove </button>
          )}
        </div>
        <div>
          <h2> comments </h2>
          <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
            <input
              onChange={(event) => setComment(event.target.value)}
              type="text"
            ></input>
            <button type="submit">Add comment </button>
          </form>
          {comments?.map(({ text, id }) => (
            <p key={id}> {text} </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
