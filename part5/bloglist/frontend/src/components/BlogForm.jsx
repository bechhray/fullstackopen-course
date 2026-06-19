import {useState} from 'react'

const BlogForm = ({createBlog }) => {
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
        <label>
          title
          <input
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
    </div>
    
  )}

export default BlogForm