const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');

const app = express();

logger.info('Connecting to...', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('Connected to MongoDB');
  })
  .catch(e => logger.error('Error connecting to MongoDB:',e.message));

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app
