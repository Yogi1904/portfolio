require('dotenv').config()

const fs = require('fs')
const express = require('express')
const app = express()
const {v4: uuid} = require('uuid')
const path = require('path')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Mongoose connected')
})
.catch(e => {
    console.log('Mongoose Connection Error:', e)
    process.exit(1)
})

const Blog = require('./models/blog')
const Project = require('./models/project')

const port = process.env.PORT || 8080

const AppError = require('./utils/app-error')
const asyncWrapper = require('./utils/async-wrapper')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

function getProjects(){
    const projectsFile = path.join(__dirname, 'projects.json')
    const data = fs.readFileSync(projectsFile)
    return JSON.parse(data)
}

//home
app.get('/', (req, res) => {
    res.render('home')
})

//blogs page
app.get('/blogs', asyncWrapper(async (req, res) => {
    const blogs = await Blog.find({})
    // const blogs = []

    if(!blogs.length){
        return res.render('blogs', {
            blogs: [],
            message: 'No blogs yet.'
        })
    }
    res.render('blogs', {blogs})
}))

//blogs create page
app.get('/blogs/create', (req, res) => {
    res.render('create')
})
//post request sent from create page
app.post('/blogs', asyncWrapper(async (req, res) => {
    const {title, content} = req.body

    const blog = new Blog({
        "title": title,
        "content": content,
        "date": new Date().toISOString(),
        "tags": []
    })
    await blog.save()

    res.redirect('/blogs')
}))

//displaying specific blog
app.get('/blogs/:id', asyncWrapper(async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError(400, 'Invalid blog ID')
    }
    const blog = await Blog.findById(id)
    if (!blog) {
        throw new AppError(404, 'Not blog found!')
    }
    res.render('blog', { blog })
    
}))
//displaying the edit page for a specific blog
app.get('/blogs/:id/edit', asyncWrapper(async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError(400, 'Invalid blog ID')
    }

    const blog = await Blog.findById(id)
    if (!blog) {
        throw new AppError(404, 'Blog not found.')
    }    
    res.render('edit', { blog })
    
}))
//processing the patch(which is actually a post request) for the blog
app.patch('/blogs/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(400, 'Invalid blog ID')
    }

    const { title, content } = req.body
    const blog = await Blog.findByIdAndUpdate(
        id,
        { title, content },
        { new: true, runValidators: true }
    )
    if (!blog) {
        throw new AppError(404, 'Blog not found')
    }

    res.redirect(`/blogs/${id}`)
}));


//displaying projects page
app.get('/projects', asyncWrapper(async (req, res) => {
    const projects = await Project.find({})
    // const projects = []

    if(!projects.length){
        return res.render('projects', {
            projects: [],
            message: 'No projects yet.'
        })
    }

    res.render('projects', {projects})
}))

//global error handling middleware
app.use((req ,res) => {
    res.status(404).render('notFound')
})

app.use((err, req, res, next) => {
    const {status = 500, message = 'Something is wrong'} = err;
    res.status(status).send(message)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})