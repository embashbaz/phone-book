
require('dotenv').config()
const express = require('express')

var morgan = require('morgan')

const PhoneBookEntry = require('./models/phoneBookEntry')

const app = express()

app.use(express.static('dist'))
app.use(express.json())




const type = morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))






const d = new Date();


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const getRadomValue = () => {
     return Math.floor(Math.random() * 1000000);
}


app.get('/api/persons', (request, response) => {
    PhoneBookEntry.find({}).then(pers => {
        response.json(pers)
    })
})

app.get('/info', (request, response) => {
    PhoneBookEntry.find({}).then(pers => {
        response.send(`<div>Phonebook info has ${pers.length} people </div></br><div>${d.toTimeString()}</div>`)
    })
    
})

app.get('/api/persons/:id', (request, response, next) =>{
    const id = request.params.id
    PhoneBookEntry.findById(id).then(per => {
        if(per){
        response.json(per)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) =>{
    const id = request.params.id
    persons = persons.filter(p => p.id !== id )

    PhoneBookEntry.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {

    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({error: 'name and number must be provided'})
    }

    const { name, number } = request.body


            const newP = new PhoneBookEntry({
                name : name,
                number : number
            })
            
            newP.save().then(newPerson => {
                response.json(newPerson)
            }).catch(error => {
                next(error)
            }) 
      
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    const { name, number } = request.body

    PhoneBookEntry.findById(id).then(per => {
        if(!per){
           return response.status(404).end()
        }
        per.name = name
        per.number = number

        per.save().then(newPerson => {
            response.json(newPerson)
        }).catch(error => {
            next(error)
        }) 

    }).catch(error => {
        next(error)
    })

})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }
  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})