const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    // Add your project fields here
    name: {
        type: String,
        required: true
    },
    description: String,
    stack: String,
    repo: String
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project