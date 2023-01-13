require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('build'))


const errorHandler = (error, _, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  return next(error)
}


morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.get('/', (_, response, next) => {
  try {
    return response.send('<h1>Hello World!</h1>')
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons', async (_, response, next) => {
  try {
    const phonebook = await Phonebook.find()
    return response.json(phonebook)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    const person = await Phonebook.findById(id)
    if (person)
      return response.status(200).json(person)
    return response.status(404).json({ message: 'No such person found.' })
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (_, response, next) => {
  try {
    const persons = await Phonebook.count()
    return response.send(`<p> Phone book has info for ${persons} people <br/> ${new Date().toString()} </p>`)
  } catch (error) {
    next(error)
  }
})


app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    await Phonebook.findByIdAndRemove(id)
    return response.status(204).end()
  } catch (error) {
    next(error)
  }

})

app.post('/api/persons', async (request, response, next) => {
  try {
    const { name, number } = request.body
    if (!name) {
      response.status(400).json({ error: 'name is not provided.' })
    }
    if (!number) {
      response.status(400).json({ error: 'number is not provided.' })
    }
    const person = new Phonebook({
      number,
      name
    })
    const createdContact = await person.save()
    return response.status(201).json({ message: 'Successfully added person', id: createdContact.id })
  } catch (error) {
    next(error)
  }

})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const { body: { name, number }, params: { id } } = request
    const updatedPerson = await Phonebook.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true })
    return response.status(200).json(updatedPerson)
  } catch (error) {
    next(error)
  }
})
app.use(errorHandler)

const PORT = process.env.PORT || 3001
const hostname = '0.0.0.0'
app.listen(PORT, hostname, () => {
  console.log(`Server running on port ${PORT}`)
})