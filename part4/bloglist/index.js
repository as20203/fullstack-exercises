const express = require('express')
const app = express()
require('express-async-errors')

const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)


const blogsRouter = require('./controller/blogs')
app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})

module.exports = app;