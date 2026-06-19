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

  test('renders content by default settings', async() => {
    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username="username" />)
    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const userElement = container.querySelector('.user')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
    expect(userElement).toBeNull()
  })

  test('shows url and likes when view button is clicked', async() => {
    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username="username" />)
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const userElement = container.querySelector('.user')
    const user = userEvent.setup()
    const button = container.querySelector('.view-button')
    await user.click(button)
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(userElement).toBeDefined()

  })

  test('calls event handler twice when like button is clicked twice', async() => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={() => {}} username="username" />)
    const viewButton = container.querySelector('.view-button')
    await user.click(viewButton)
    const likeButton = container.querySelector('.like-button')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})
