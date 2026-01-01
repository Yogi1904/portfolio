const fs = require('fs')
const express = require('express')
const { get } = require('http')
const path = require('path')
const app = express()

const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '/public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

function getBlogs(){
    const blogsFile = path.join(__dirname, 'blogs.json')
    const data = fs.readFileSync(blogsFile, 'utf-8')
    return JSON.parse(data)
}

function getProjects(){
    const projectsFile = path.join(__dirname, 'projects.json')
    const data = fs.readFileSync(projectsFile)
    return JSON.parse(data)
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/blog', (req, res) => {
    const blogs = getBlogs()
    res.render('blogs', {blogs})
})

app.get('/projects', (req, res) => {
    const projects = getProjects()
    res.render('projects', {projects})
})

app.get('/blogs/:id', (req, res) => {
    const {id} = req.params
    const blogs = getBlogs()
    const blog = blogs.find(b => b.id === id)

    if(!blog){
        return res.render('notFound', {id})
    }

    res.render('blog', {blog})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})