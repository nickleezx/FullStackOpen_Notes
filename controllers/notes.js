const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
});

notesRouter.get('/:id', async (req, res, next) => {
  const result = await Note.findById(req.params.id)

  result ? res.json(result) : res.status(404).end()

})

notesRouter.post('/', async (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
  })

  const savedNote = await note.save()
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