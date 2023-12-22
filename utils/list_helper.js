const Blog = require('../models/blog')
const blogs = Blog.find({})

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfAllLikes = blogs.reduce((total, blog) => total + blog.likes, 0)
  return sumOfAllLikes
}
  
const mostLikes = (blogs) => {
  const eachLike = blogs.map(blog => blog.likes)
  const maxLike = Math.max(...eachLike)
  const returnedBlog = blogs.find(blog => blog.likes === maxLike)
  const realReturnedBlog = {
    title: returnedBlog.title,
    author: returnedBlog.author,
    likes: returnedBlog.likes
  }
  return realReturnedBlog
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes
}

