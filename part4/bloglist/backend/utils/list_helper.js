const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (!blogs) return 0
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const authorCounts = {}
  for (const blog of blogs) {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  }
  let authorWithMostBlogs = { author: null, blogs: 0 }
  for (const author in authorCounts) {
    if (authorCounts[author] > authorWithMostBlogs.blogs) {
      authorWithMostBlogs = { author, blogs: authorCounts[author] }
    }
  }
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const authorLikes = {}
  for (const blog of blogs) {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  }
  let authorWithMostLikes = { author: null, likes: 0 }
  for (const author in authorLikes) {
    if (authorLikes[author] > authorWithMostLikes.likes) {
      authorWithMostLikes = { author, likes: authorLikes[author] }
    }
  }
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

