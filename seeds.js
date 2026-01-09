const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
.then(() => {
    console.log('Mongoose connected')
})
.catch(e => {
    console.log('Mongoose Connection Error:', e)
})

const Blog = require('./models/blog')
const Project = require('./models/project')

Blog.insertMany([
  {
    "id": "1",
    "title": "Starting My Web Development Journey",
    "content": "Today marks the beginning of my journey into web development. I've decided to learn Node.js and Express to build full-stack applications. The Colt Steele bootcamp has been incredibly helpful so far.",
    "date": "2024-01-15",
    "tags": [
      "learning",
      "webdev",
      "personal"
    ]
  },
  {
    "id": "2",
    "title": "Understanding Express Routing",
    "content": "Express routing is fascinating. The way you can create dynamic routes using parameters and query strings opens up so many possibilities. Today I built a simple blog system to practice these concepts.",
    "date": "2024-01-20",
    "tags": [
      "express",
      "backend",
      "nodejs"
    ]
  },
  {
    "id": "3",
    "title": "Why I Love Building Things",
    "content": "There's something magical about taking an idea and turning it into a working application. Every bug fixed, every feature added - it all adds up to something real that people can use.",
    "date": "2024-01-25",
    "tags": [
      "motivation",
      "personal",
      "coding"
    ]
  },
  {
    "title": "Post Deployment",
    "content": "This is my first blog since the website has been made!",
    "id": "11a81067-f5c5-40cb-822a-8c045b9b44be",
    "date": "2026-01-01T11:55:49.536Z",
    "tags": []
  }
])
.then(data => {
    console.log('Data inserted', data)
})
.catch(e => {
    console.log('Error: ', e)
})