require('dotenv').config();
const express = require('express');
const Note = require('./models/note');
// const cors = require('cors');
const app = express();

// app.use(cors());
app.use(express.static('dist'))
app.use(express.json());

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>');
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 
        ? Math.max(...notes.map(n => Number(n.id))) 
        : 0
    return String(maxId + 1);
}

app.post('/api/notes', (request, response) => {
    
    const body = request.body;

    if (!body.content){
        return response.status(400).json({
            error: "missing content"
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })

})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
