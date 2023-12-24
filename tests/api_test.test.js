const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./api_test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlog)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlog.length)
})

test('all blogs have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
  
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
  
test('a valid blog can be added, and the number of blogs increases ', async () => {
  const newBlog = {
    title: "Cloud computing",
    author: "Tungdt",
    url: "https://cloudcomputing.com/",
    likes: 15,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'Cloud computing'
  )
})

test('a blog which lacks likes is still valid and its likes will be 0', async () => {
  const newBlog = {
    title: "Cloud computing",
    author: "Tungdt",
    url: "https://cloudcomputing.com/",
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const length = blogsAtEnd.length
  expect(blogsAtEnd[length-1].likes).toEqual(0)
})

test('a blog which lacks title cannot be created', async () => {
  const newBlog = {
    author: "Tungdt",
    url: "https://cloudcomputing.com/",
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('a blog which lacks url cannot be created', async () => {
  const newBlog = {
    title: "cloud computing",
    author: "Tungdt",
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
}) 