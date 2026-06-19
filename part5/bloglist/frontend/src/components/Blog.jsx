import { useState  } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <div>
          {blog.url}
          <br />
          {blog.likes} likes <button onClick={handleLike}>like</button>
          <br />
          {blog.user.name}
          <br />
          {blog.user && blog.user.username === username && (
            <button onClick={() => deleteBlog(blog.id, blog.title)}>remove</button>
          )}
        </div>
      )}
    </div>
  )

}
export default Blog