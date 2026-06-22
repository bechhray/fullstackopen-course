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
    <div style={blogStyle} className='blog'>
      <span className='title'>{blog.title}</span> By <span className='author'>{blog.author}</span>
      <button className='view-button' onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <div>
          <span className='url'>{blog.url}</span>
          <br />
          <span className='likes'>{blog.likes} likes</span>
          <button className='like-button' onClick={handleLike}>like</button>
          <br />
          <span className='user'>{blog.user.name}</span>
          <br />
          {blog.user && blog.user.username === username && (
            <button className='remove-button' onClick={() => deleteBlog(blog.id, blog.title)}>remove</button>
          )}
        </div>
      )}
    </div>
  )

}
export default Blog