import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { Button, Container, Form, Input } from '../styledComponents'
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

  return (
    <Container padding="10px">
      <Container padding="10px" margin="10px 0px 5px 0px" fontWeight="bold">
        <span id="blog-title"> {blog?.title} </span>{' '}
        <span id="blog-creator"> {blog?.user?.name} </span>
      </Container>

      <Container display="flex" flexDirection="column">
        <Link
          style={{
            color: 'blue',
            textDecoration: 'none',
            padding: '10px',
          }}
          to={blog?.url}
          className="blogUrl"
        >
          {' '}
          {blog?.url}{' '}
        </Link>
        <span style={{ padding: '10px' }}>
          likes {blog.likes}{' '}
          <Button
            padding="10px"
            className="blogLikesButton"
            onClick={() => handleLikes()}
          >
            {' '}
            like{' '}
          </Button>
        </span>
        {blog?.author && `added by ${blog?.author}`}
        <Container margin="5px">
          {getUserId() === blog?.user?.id && (
            <Button
              backgroundColor="red"
              color="white"
              onClick={() => handleDelete()}
            >
              {' '}
              remove{' '}
            </Button>
          )}
        </Container>
        <div>
          <Container width={400}>
            <h2> comments </h2>
            <Form onSubmit={handleSubmit}>
              <Input
                onChange={(event) => setComment(event.target.value)}
                type="text"
              />
              <Button type="submit">Add comment </Button>
            </Form>
          </Container>

          {comments?.map(({ text, id }) => (
            <p key={id}> {text} </p>
          ))}
        </div>
      </Container>
    </Container>
  )
}

export default Blog
