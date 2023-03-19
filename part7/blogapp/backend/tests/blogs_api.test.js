const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blogs')
const User = require('../models/users')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')

let token = ''
let userId = ''
beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const password = 'sekret'
  const username = 'root'
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ username, passwordHash })

  const newUser = await user.save()
  userId = newUser.id
  const result = await api.post('/api/login').send({
    username,
    password,
  })

  await Blog.insertMany(
    helper.initialBlogs.map((blog) => {
      return { ...blog, user: userId }
    })
  )

  token = result.body.token
})

describe('when there are some initial blogs saved', () => {
  test('blogs are returned as json.', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs id is defined.', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('addition of a new blog', () => {
  test('blog is created.', async () => {
    const post = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: userId,
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const newBlogs = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
    const { id, ...newBlogPost } = response.body
    expect(id).toBeDefined()
    expect(newBlogPost).toEqual(post)
    expect(newBlogs.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('blog creation fails without token.', async () => {
    const post = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: userId,
    }
    await api
      .post('/api/blogs')
      .send(post)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Checking blog properties', () => {
  test('blog has like property.', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    response.body.forEach((blog) => {
      expect(blog.likes).toBeDefined()
    })
  })

  test('blog has missing title or url.', async () => {
    const post = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

      .send(post)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Deleting a single blog resource.', () => {
  test('succeeds with status code 204 if id is valid.', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('Upadting a single blog resource.', () => {
  test('succeeds with status code 200 if successfully updated blog.', async () => {
    const blog = { likes: 34 }
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)

      .send(blog)
      .expect(200)

    expect(updatedBlog.body.likes).toEqual(blog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
