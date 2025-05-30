const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }

  return null
}

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('user', {username: 1, name: 1})

  res.json(notes)
});

notesRouter.get('/:id', async (req, res, next) => {
  const result = await Note.findById(req.params.id)

  result ? res.json(result) : res.status(404).end()

})

notesRouter.post('/', async (req, res, next) => {
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id)
    return res.status(401).json({error: 'token invalid'})


  const user = await User.findById(decodedToken.id)
  
  if(!user)
    return res.status(400).json({error: 'userId missing or not valid'})
  
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
});

notesRouter.delete('/:id', async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id)
  res.status(204).end()

});

notesRouter.put('/:id', (req, res, next) => {
  const {content, important} = req.body;

  Note.findById(req.params.id)
    .then(note => {
      if(!note)
        return response.status(404).end();

      note.content = content;
      note.important = important;

      return note.save()
              .then(result => {
                res.json(result);
              })
    })
    .catch(error => next(error));
})

module.exports = notesRouter