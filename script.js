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
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs', {blogs})
})
//blogs create page
app.get('/blogs/create', (req, res) => {
    res.render('create')
})
//post request sent from create page
app.post('/blogs', async (req, res) => {
    const {title, content} = req.body

    const blog = new Blog({
        "title": title,
        "content": content,
        "date": new Date().toISOString(),
        "tags": []
    })
    await blog.save()

    res.redirect('/blog')
})
//displaying specific blog
app.get('/blogs/:id', async (req, res) => {
    const {id} = req.params
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).render('notFound')
        }
        res.render('blog', { blog })
    } catch (err) {
        return res.status(400).render('notFound')
    }
})
//displaying the edit page for a specific blog
app.get('/blogs/:id/edit', async (req, res) => {
    const {id} = req.params
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).render('notFound')
        }
        
        res.render('edit', { blog })
    } catch (err) {
        return res.status(400).render('notFound')
    }
})
//processing the patch(which is actually a post request) for the blog
app.patch('/blogs/:id', async (req, res) => {
    const {id} = req.params
    try {
        const {title, content} = req.body
        await Blog.findByIdAndUpdate(id, {title: title, content: content}, {new:true, runValidators:true})
        res.redirect(`/blogs/${id}`)
    } catch (err) {
        return res.status(400).render('notFound')
    }
})

//displaying projects page
app.get('/projects', async (req, res) => {
    const projects = await Project.find({})
    res.render('projects', {projects})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})