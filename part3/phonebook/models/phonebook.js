const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    //Length of 8 is excluding the hiphen.
    type: String, required: true, minLength: 9, validate: {
      validator:  (v) => /^\d{2,3}-\d+$/.test(v)
    }
  },
})

phonebookSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)