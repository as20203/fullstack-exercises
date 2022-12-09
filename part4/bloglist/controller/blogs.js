const blogsRouter = require('express').Router()
const Blog = require('../models/blogs');

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body;
  if (!title || !url)
    return response.status(400).json({ message: `Missing property: ${url ? 'url' : 'title'}` })

  const blog = new Blog(request.body)
  const result = await blog.save();
  return response.status(201).json(result);
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { body: { likes }, params: { id } } = request;
  const post = {
    likes
  }
  const updatedBlogPost = await Blog.findByIdAndUpdate(id, post, { new: true })
  return response.json(updatedBlogPost)
})

module.exports = blogsRouter
