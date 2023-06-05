import { useState } from 'react'
import { Button, Container, Form, Input } from '../styledComponents'

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
    <Container width="500">
      <Form style={{ padding: '20px 0px' }} onSubmit={addBlog}>
        Create new:
        <Container margin="5px 0 0 0">
          title:
          <Input
            id="title"
            required
            type="text"
            value={blog.title}
            name="title"
            onChange={(event) => handleChange(event)}
          />
        </Container>
        <Container>
          author:
          <Input
            id="author"
            required
            type="text"
            value={blog.author}
            name="author"
            onChange={(event) => handleChange(event)}
          />
        </Container>
        <Container>
          url:
          <Input
            id="url"
            required
            type="text"
            value={blog.url}
            name="url"
            onChange={(event) => handleChange(event)}
          />
        </Container>
        <Button id="add-blog-button" type="submit">
          create
        </Button>
      </Form>
    </Container>
  )
}

export default BlogForm
