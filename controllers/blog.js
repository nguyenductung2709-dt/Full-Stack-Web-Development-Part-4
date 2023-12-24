const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  const allBlogs = await Blog.find({})
  let htmlResponse = '<h1>All Blogs</h1>'
  htmlResponse += '<ul>'
  allBlogs.forEach(blog => {
  htmlResponse += `<li>Title: ${blog.title}, Author: ${blog.author}, Likes: ${blog.likes}</li>`
  })
  htmlResponse += '</ul>'
  response.send(htmlResponse)
})

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/api/blogs/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/api/blogs/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
  const body = request.body
  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({ error: 'Required fields are missing' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/api/blogs/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
