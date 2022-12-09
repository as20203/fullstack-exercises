const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blogs')
const api = supertest(app)
const helper = require('./test_helper');



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('when there are some initial blogs saved', () => {
    test('blogs are returned as json.', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('blogs id is defined.', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
        });
    }) 
})


describe('addition of a new blog', () => {
    test('blog is created.', async () => {
        const post = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
        }
        const response = await api
            .post('/api/blogs')
            .send(post)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const newBlogs = await api.get('/api/blogs')
        const { id, ...newBlogPost } = response.body;
        expect(id).toBeDefined()
        expect(newBlogPost).toEqual(post)
        expect(newBlogs.body).toHaveLength(helper.initialBlogs.length + 1)
    })
})


describe('Checking blog properties', () => {
    test('blog has like property.', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        response.body.forEach(blog => {
            expect(blog.likes).toBeDefined()
        });
    })
    
    
    test('blog has missing title or url.', async () => {
        const post = {
            title: "First class tests",
            author: "Robert C. Martin",
            likes: 10,
        }
        await api
            .post('/api/blogs')
            .send(post)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})


describe('Deleting a single blog resource.', () => {
    test('succeeds with status code 204 if id is valid.', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        console.log({blogToDelete})
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
    
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)
      })
})

describe('Upadting a single blog resource.', () => {
    test('succeeds with status code 200 if successfully updated blog.', async () => {
        const blog = { likes: 34 };
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blog)
          .expect(200)
    
        expect(updatedBlog.body.likes).toEqual(blog.likes)
        
      })
})



afterAll(() => {
    mongoose.connection.close()
})