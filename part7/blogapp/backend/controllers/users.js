const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  console.log({ id })
  const users = await User.findById(id).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Password length should be atleast three characters long.',
    })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: 'Username should be atleast three characters long.',
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})

module.exports = usersRouter
