const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms | :res[content-length] | :body'))
//app.use(requestLogger)

let persons = [
  {
    "id": 1,
    "name": "John Navarro",
    "number": "8924-6888"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Ivette Ramirez",
    "number": "2222-3333"
  },
]

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  : 0

  return maxId + 1
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const personsInfo = persons.length
  const date = new Date()
  response.send(`Phonebook has info for ${personsInfo} people ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if(person) {
    console.log('Person found')
    response.json(person)
    response.status(200).end()
  } else {
    console.log('Person not found')
    response.send('<h1>404 Not Found</h1>')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const nameExist = persons.some(p => p.name === body.name)

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is required'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Number is required'
    })
  } else if (nameExist) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  persons = persons.concat(person)
  response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`)
})