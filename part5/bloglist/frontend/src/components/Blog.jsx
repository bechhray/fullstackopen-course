import Notification from './Notification'

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5
  // }
  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  if (!blog) return null

  return (
    <div className='blog'>
      <h3>{blog.author}: {blog.title}</h3>
      <div>
        <a className='url' href={blog.url} target='_blank'>{blog.url}</a>
        <br />
        <span className='likes'>{blog.likes} likes</span>
        {username && (
          <button className='like-button' onClick={handleLike}>like</button>
        )}
        <br />
        <span className='user'>Added by {blog.user.name}</span>
        <br />
        {blog.user && blog.user.username === username && (
          <button className='remove-button' onClick={() => deleteBlog(blog.id, blog.title)}>remove</button>
        )}
      </div>
    </div>
  )

}
export default Blog