const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Blog = require('./models/blog')

app.use(cors())
app.use(express.json())

morgan.token('post-data', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use((req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :res[content-length] - :response-time ms :post-data')(req, res, next)
  } else {
    morgan('tiny')(req, res, next)
  }
})

app.get('/', async (request, response, next) => {
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
  

app.get('/api/blogs', (request, response) => {
  Blog.find({}) .then(blogs => {
    response.json(blogs)
  })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})


/*app.get('/api/info', async (request, response) => {
  Blog.find({})
    .then(blogs => {
      const number = blogs.length
      const currentDate = new Date().toUTCString()
      response.set('Date', currentDate)
      response.send(
        `<p>Phone book has info for ${number} people</p>` +
        `<p>Current Date: ${currentDate}</p>`
      )
    })
    .catch(error => next(error))
})*/


app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      response.json(blog)
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/blogs', async (request, response, next) => {
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


app.put('/api/blogs/:id', (request, response, next) => {
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  /*console.error(error.message)*/

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  