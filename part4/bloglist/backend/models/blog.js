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
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)