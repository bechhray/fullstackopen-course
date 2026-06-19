import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async() => {
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

  const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} username="username" />)
  screen.debug()
  const title = container.querySelector('.title')
  const author = container.querySelector('.author')
  const url = container.querySelector('.url')
  const likes = container.querySelector('.likes')
  const user = container.querySelector('.user')
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
  expect(user).toBeNull()

  // const mockHandler = vi.fn()
  // const user = userEvent.setup()
  // const button = screen.getByText('view')
  // await user.click(button)
  // expect(mockHandler.mock.calls).toHaveLength(1)
})