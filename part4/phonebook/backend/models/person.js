const mongoose = require('mongoose')
const config = require('../utils/config')
const { info, error } = require('../utils/logger')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

info('connecting to', url)
mongoose
  .connect(url)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch(err => {
    error('error connecting to MongoDB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: () =>
        'The phone number must be at least 8 characters long and must contain a hyphen after the second or third digit (e.g., 040-6655678).'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)