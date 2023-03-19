import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'abc',
    author: 'jawad',
    url: 'https://abc.jawad.com',
    likes: 3,
    user: {
      username: 'jawad',
      name: 'Jawad Zaheer',
      id: '63bf13fc1009f6e2def6308e',
    },
    id: '63c1ffbdca82b7dc66e7a00d',
  }

  const { container } = render(<Blog blog={blog} />)

  const author = screen.getByText(blog.user.name)
  const title = screen.getByText(blog.title)
  const url = container.querySelector('.blogUrl')
  const likes = container.querySelector('.blogLikes')
  expect(author).toBeDefined()
  expect(title).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('checking if url and likes are displayed after showing details.', async () => {
  const blog = {
    title: 'abc',
    author: 'jawad',
    url: 'https://abc.jawad.com',
    likes: 3,
    user: {
      username: 'jawad',
      name: 'Jawad Zaheer',
      id: '63bf13fc1009f6e2def6308e',
    },
    id: '63c1ffbdca82b7dc66e7a00d',
  }

  const { container } = render(<Blog blog={blog} />)
  const button = container.querySelector('.showDetailsButton')

  const user = userEvent.setup()
  await user.click(button)

  const url = container.querySelector('.blogUrl')
  const likes = container.querySelector('.blogLikes')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('checking the count of likes after clicking the button.', async () => {
  const blog = {
    title: 'abc',
    author: 'jawad',
    url: 'https://abc.jawad.com',
    likes: 3,
    user: {
      username: 'jawad',
      name: 'Jawad Zaheer',
      id: '63bf13fc1009f6e2def6308e',
    },
    id: '63c1ffbdca82b7dc66e7a00d',
  }

  const mockHandler = jest.fn()

  const { container } = render(<Blog blog={blog} setBlogs={mockHandler} />)
  const button = container.querySelector('.showDetailsButton')

  const user = userEvent.setup()
  await user.click(button)

  const likesButton = container.querySelector('.blogLikesButton')
  await user.click(likesButton)
  await user.click(likesButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> check data of blog created via form if it matches.', async () => {
  const blog = {
    title: 'abc',
    author: 'jawad',
    url: 'https://abc.jawad.com',
  }
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)
  const blogInputs = screen.getAllByRole('textbox')
  const title = blogInputs[0]
  const author = blogInputs[1]
  const url = blogInputs[2]

  const sendButton = screen.getByText('create')

  await user.type(title, blog.title)
  await user.type(author, blog.author)
  await user.type(url, blog.url)

  await user.click(sendButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
})
