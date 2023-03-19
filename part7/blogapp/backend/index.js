const express = require('express')
const app = express()
require('express-async-errors')

const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const mongoose = require('mongoose')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('build'))

const { requestLogger, tokenExtractor, userExtractor, errorHandler } =
  middleware

app.use(requestLogger)
app.use(tokenExtractor)

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

const PORT = 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

module.exports = app
