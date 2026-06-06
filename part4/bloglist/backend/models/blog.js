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

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)