const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contacts = require("./models/contact")

//Middlewares
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms | :res[content-length] | :body'))
//app.use(requestLogger)

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  : 0

  return maxId + 1
}

app.get('/', (request, response) => {
  response.send('<p>/api/persons to see the contacts list </p>')
})

app.get('/api/persons', (request, response) => {
  Contacts.find({}).then(contacts => {
    console.log("Done process");
    response.json(contacts)
  })
})

app.get('/info', (request, response) => {
  Contacts.find({}).then(contacts => {
    const personsInfo = contacts.length
    const date = new Date()
    console.log(personsInfo);
    response.send(`Phonebook has info for ${personsInfo} people ${date}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const person = persons.find(p => p.id === id)
  Contacts.findById(request.params.id).then(contact => {
    if(contact) {
      console.log('Contact found')
      response.json(contact)
      response.status(200).end()
    } else {
      console.log('Contact not found')
      response.send('<h1>404 Not Found</h1>')
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = (request.params.id)
  console.log(id);
  
  Contacts.findByIdAndDelete(id).then(contact => {
    console.log(contact);
  }).catch(error => next(error))
  
  Contacts.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  //const nameExist = persons.some(p => p.name === body.name)
  // if (!body.name) {
  //   return response.status(400).json({
  //     error: 'Name is required'
  //   })
  // } else if (!body.number) {
  //   return response.status(400).json({
  //     error: 'Number is required'
  //   })
  // } else if (nameExist) {
  //   return response.status(400).json({
  //     error: 'Name must be unique'
  //   })
  // }

  if(body.name === undefined) {
    return response.status(400).json({error: "Content missing"})
  }
  const contact = new Contacts({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  }). catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  const contact = {
    name: body.name,
    number: body.number
  }
  //console.log(contact);

  Contacts.findByIdAndUpdate(id, contact, {new:true})
  .then(updatedContact => {
    //console.log(updatedContact);
    response.json(updatedContact)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
  
app.use(unknownEndpoint)
  

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if(error.name === "CastError") {
    return response.status(400).send({error: "malfomatted id"})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`)
})