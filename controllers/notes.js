const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (req, res) => {
  Note.find({}).then(result => {
    res.json(result);
  });
});

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(result => {
      if(result)
        res.json(result)
      else
        ResizeObserver.status(404).end()
    })
    .catch(error => next(error))
})

notesRouter.post('/', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
  })

  note.save
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
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