import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Author Name',
    url: 'http://example.com',
    likes: 0,
    user: {
      name: 'User Name',
      username: 'username'
    }
  }

  test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', async() => {
    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username={null} />)
    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const userElement = container.querySelector('.user')
    const likeButton = container.querySelector('.like-button')
    const deleteButton = container.querySelector('.remove-button')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(userElement).toBeDefined()
    expect(likeButton).toBeNull()
    expect(deleteButton).toBeNull()
  })

  test('Authenticated users who are not the blog’s creator are shown only the like button', async() => {
    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username="rbech" />)
    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const userElement = container.querySelector('.user')
    const likeButton = container.querySelector('.like-button')
    const deleteButton = container.querySelector('.remove-button')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(userElement).toBeDefined()
    expect(likeButton).toBeDefined()
    expect(deleteButton).toBeNull()
  })

  test('The blog’s creator is also shown the delete button', async() => {
    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username="username" />)
    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const userElement = container.querySelector('.user')
    const likeButton = container.querySelector('.like-button')
    const deleteButton = container.querySelector('.remove-button')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(userElement).toBeDefined()
    expect(likeButton).toBeDefined()
    expect(deleteButton).toBeDefined()
  })

  test('calls event handler twice when like button is clicked twice', async() => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={() => {}} username="username" />)
    const likeButton = container.querySelector('.like-button')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})
