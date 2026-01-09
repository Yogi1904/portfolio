const mongoose = require('mongoose')

//defining schema for the model
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    date: {
        type: Date, 
        default: Date.now
    },
    tags: [String]
})

//defining model
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog