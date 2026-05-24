const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://rayenebech_db_user:${password}@cluster0.89rzzrr.mongodb.net/personsApp?appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length >= 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    'name': name,
    'number': number
  })

  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook.`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}