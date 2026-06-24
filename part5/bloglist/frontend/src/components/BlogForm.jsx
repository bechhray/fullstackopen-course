import { useState } from 'react'
import { TextField, Button } from '@mui/material'


const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async event => {
    event.preventDefault()
    console.log('adding blog with title', newTitle)
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder="Enter blog title"
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder="Enter blog author"
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <TextField
            label="url"
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder="Enter blog URL"
            style={{ marginTop: 10 }}
          />
        </div>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )}

export default BlogForm