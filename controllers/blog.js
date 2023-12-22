const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    try {
      const allBlogs = await Blog.find({});
  
      let htmlResponse = '<h1>All Blogs</h1>';
      htmlResponse += '<ul>';
      allBlogs.forEach(blog => {
        htmlResponse += `<li>Title: ${blog.title}, Author: ${blog.author}, Likes: ${blog.likes}</li>`;
      });
      htmlResponse += '</ul>';
  
      response.send(htmlResponse);
    } catch (error) {
      next(error);
    }
  });
  

blogsRouter.get('/api/blogs', (request, response) => {
  Blog.find({}) .then(blogs => {
    response.json(blogs)
  })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})

blogsRouter.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      response.json(blog)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/api/blogs/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
    const body = request.body;
  
    try {
      if (!body.title || !body.author || !body.url || !body.likes) {
        return response.status(400).json({ error: 'Required fields are missing' });
      }
  
      const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      });
  
      const savedBlog = await newBlog.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  });


blogsRouter.put('/api/blogs/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter