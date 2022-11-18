const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv?.[3]
const phoneNumber = process.argv?.[4]
const url = `mongodb+srv://jawadzaheer:${password}@cluster0.cx0sl.mongodb.net/?retryWrites=true&w=majority`
const phonebookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (personName && personName && process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(async () => {
      const person = new Phonebook({
        number: phoneNumber,
        name: personName
      })
      await person.save()
      console.log(`added ${personName} number ${phoneNumber} to phonebook`)
      return mongoose.connection.close()
    })
    .catch(error =>
      console.log(error)
    )
}

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(async () => {
      const persons = await Phonebook.find()
      if (persons.length) {
        console.log('phonebook:')
        persons.forEach(({ name, number }) => console.log(`${name} ${number}`))

      }
      return mongoose.connection.close()
    })
    .catch(error =>
      console.log(error)
    )
}

