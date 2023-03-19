const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs = []) => {
  const likes = blogs.reduce(
    (accumulator, currentValue) => currentValue.likes + accumulator,
    0
  )
  return likes
}

const favoriteBlog = (blogs = []) => {
  const blogWithGreatestLikes = blogs.reduce((firstBlog, secondBlog) =>
    firstBlog.likes > secondBlog.likes ? firstBlog : secondBlog
  )
  const { title, author, likes } = blogWithGreatestLikes
  return { title, author, likes }
}

const mostBlogs = (blogs = []) => {
  const authorsWithBlogs = {}
  blogs.forEach(
    (blog) =>
      (authorsWithBlogs[blog.author] = !isNaN(authorsWithBlogs[blog.author])
        ? authorsWithBlogs[blog.author] + 1
        : 1)
  )
  console.log({ authorsWithBlogs })
  const authorWithMostBlogs = Object.keys(authorsWithBlogs).reduce(
    (firstAuthor, secondAuthor) =>
      authorsWithBlogs[firstAuthor] > authorsWithBlogs[secondAuthor]
        ? firstAuthor
        : secondAuthor
  )
  return {
    author: authorWithMostBlogs,
    blogs: authorsWithBlogs[authorWithMostBlogs],
  }
}

const mostLikes = (blogs = []) => {
  const authorWithLikes = {}
  blogs.forEach(
    (blog) =>
      (authorWithLikes[blog.author] = !isNaN(authorWithLikes[blog.author])
        ? authorWithLikes[blog.author] + blog.likes
        : blog.likes)
  )
  const authorWithMostBlogs = Object.keys(authorWithLikes).reduce(
    (firstAuthor, secondAuthor) =>
      authorWithLikes[firstAuthor] > authorWithLikes[secondAuthor]
        ? firstAuthor
        : secondAuthor
  )
  return {
    author: authorWithMostBlogs,
    likes: authorWithLikes[authorWithMostBlogs],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
