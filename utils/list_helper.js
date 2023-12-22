const Blog = require('../models/blog')
const blogs = Blog.find({});

const dummy = (blogs) => {
    return 1;
  }
  
  module.exports = {
    dummy
  }