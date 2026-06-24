import Notification from './Notification'
import styled from 'styled-components'


const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  const blogStyle = {
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 15,
    border: 'solid',
    borderWidth: 0.5,
    marginBottom: 5
  }
  const LikeButton = styled.button`
    background-color: white;
    color: #007bff;
    padding: 5px 10px;
    border: 1px solid #007bff;
    margin: 5px 10px;
`
  const RemoveButton = styled.button`
    background-color: white;
    color: #dc3545;
    padding: 5px 10px;
    border: 1px solid #dc3545;
    margin: 5px 10px;
`
  const BlogContainer = styled.div`
    border: 1px solid #ccc;
  `
  const Author = styled.div`
    color: #555;
    margin-bottom: 5px;
  `
  const Title = styled.h3`
    margin: 10;
  `
  const Link = styled.a`
    color: #1a0dab;
    text-decoration: none;
  `
  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  if (!blog) return null

  return (
    <BlogContainer className='blog' style={blogStyle}>
      <Title className='title'>{blog.author}: {blog.title}</Title>
      <Author className='author'>by {blog.author}</Author>
      <div>
        <Link className='url' href={blog.url} target='_blank'>{blog.url}</Link>
        <br />
        <br />
        <Author className='user'>Added by {blog.user.name}</Author>
        <br />
        <span className='likes'>{blog.likes} likes</span>
        {username && (
          <LikeButton className='like-button' onClick={handleLike}>LIKE</LikeButton>
        )}
        {blog.user && blog.user.username === username && (
          <RemoveButton className='remove-button' onClick={() => deleteBlog(blog.id, blog.title)}>REMOVE</RemoveButton>
        )}
      </div>
    </BlogContainer>
  )

}
export default Blog