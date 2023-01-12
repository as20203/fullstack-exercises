const blogsRouter = require('express').Router()
const Blog = require('../models/blogs');
const User = require('../models/users');

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  return response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const userId = user.id;
  const blog = await Blog.findById(request?.params?.id);
  console.log({ blog });
  if ( blog?.user.toString() === userId.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    return  response.status(204).end();
  }
  return  response.status(403).json({ error: 'Operation not allowed.' })

})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const { title, url } = request.body;
  if (!title || !url)
    return response.status(400).json({ message: `Missing property: ${url ? 'url' : 'title'}` })
  const existingUser = await User.findOne({ _id: user.id })
  const blog = new Blog({...request.body, user: existingUser.id  })
  const result = await blog.save();
  existingUser.blogs = existingUser.blogs.concat(result._id)
  await existingUser.save()
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
