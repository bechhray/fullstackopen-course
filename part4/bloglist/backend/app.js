const express = require('express')
const blogsRouter = require('./controllers/blog')
const { errorHandler, unknownEndpoint, morgan } = require('./utils/middleware')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app