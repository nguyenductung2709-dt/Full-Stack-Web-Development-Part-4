const Blog = require('../models/blog')
const blogs = Blog.find({})

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfAllLikes = blogs.reduce((total, blog) => total + blog.likes, 0)
  return sumOfAllLikes
}
  
module.exports = {
  dummy,
  totalLikes
}

