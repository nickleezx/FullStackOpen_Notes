const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "Unknown endpoint"});
}

const errorHandler = (error, req, res, next) => {
  logger.info(error)

  if (error.name === 'CastError')
    return res.status(400).send({error: 'malformatted id'});

  else if (error.name === 'ValidationError')
    return res.status(400).json({error: error.message})
  
  else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error'))
    return res.status(400).json({error: 'expected `username` to be unique'})

  else if (error.name === 'JsonWebTokenError')
    return res.status(401).json({error: 'token invalid'})

  else if (error.name === 'TokenExpiredError')
    return res.status(401).json({error: "token expired"})

  next(error);
}

module.exports = {requestLogger, errorHandler, unknownEndpoint}