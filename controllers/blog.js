const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*const getTokenFrom = (request) => {
  const authorization = request.headers.authorization
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}*/

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
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  console.log(request.token)
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'Invalid or missing token' })
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0, // Assuming likes might be optional
      user: user._id
    });

    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save() // Save the updated user with new blog ID

    response.status(201).json(savedBlog)
  } catch (error) {
    console.error('Error creating blog:', error.message)
    response.status(500).json({ error: 'Internal server error' })
  }
})


blogsRouter.put('/api/blogs/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
