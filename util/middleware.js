function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(err => err.message)
    return response.status(400).json({ errors: messages })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(500).json({ error: 'Database query error' })
  }
  
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}