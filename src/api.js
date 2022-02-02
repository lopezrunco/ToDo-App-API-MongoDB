require('dotenv').config()

const mongoose = require('mongoose')
const mongooseToJson = require('@meanie/mongoose-to-json') // Cleans the requests on the fields _id and __v
const express = require('express')
const cors = require('cors')
const getDbConnectionString = require('./utils/get-db-connection-string') // Return the conection string

// Configuration of database plugins ---------------------------------------------------------------------------- //

mongoose.plugin(mongooseToJson)
 
// Create app express ---------------------------------------------------------------------------- //

const app = express()

// Middlewares ---------------------------------------------------------------------------------------- //

const checkUserCredentials = require('./middlewares/check-user-credentials')
const checkUserRole = require('./middlewares/check-user-role')

// Cors returns middleware function that opens the API in security terms, to connect the front-end (Allow conections between the same IP)
app.use(cors())

// Understand the JSON sended to the API
app.use(express.json())

// Controllers ----------------------------------------------------------------------------- //

// Security
const enableMfa = require('./controllers/auth/enable-mfa')
const refresh = require('./controllers/auth/refresh')

// Users
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')
const getAllUsers = require('./controllers/user/get-all')
const getUserById = require('./controllers/user/get-by-id')

// Todos
const getAllTodos = require('./controllers/todos/get-all')
const getTodoById = require('./controllers/todos/get-by-id')
const createTodo = require('./controllers/todos/create')
const deleteTodo = require('./controllers/todos/delete')
const updateTodo = require('./controllers/todos/update')

// Events
const createEvent = require('./controllers/events/create')
const getGroupedEvents = require('./controllers/events/get-grouped-events')
const getLoginRegisterGroupedEvents = require('./controllers/events/get-grouped-login-register-events')
const getLoginEventsInOverTime = require('./controllers/events/login/get-login-events-in-over-time')
const getLoginEvents = require('./controllers/events/login/get-login-events')
const getLoginEventsCount = require('./controllers/events/login/get-login-events-count')
const getRegisterEventsInOverTime = require('./controllers/events/register/get-register-events-in-over-time')
const getRegisterEvents = require('./controllers/events/register/get-register-events')
const getRegisterEventsCount = require('./controllers/events/register/get-register-events-count')

const getNavigationEventsInOverTime = require('./controllers/events/navigation/get-navigation-events-in-over-time')

// Routes definition -------------------------------------------------------------------------------- //

// Security
app.get('/auth/mfa', checkUserCredentials(), enableMfa)
app.get('/auth/refresh', checkUserCredentials('REFRESH'), refresh)

// Users
app.post('/login', login)
app.post('/register', register)
app.get('/admin/users', checkUserCredentials(), checkUserRole(['ADMIN']), getAllUsers)
app.get('/admin/users/:id', checkUserCredentials(), checkUserRole(['ADMIN']), getUserById)

// Todos
app.get('/todos', checkUserCredentials(), getAllTodos)
app.get('/todos/:id', checkUserCredentials(), getTodoById)
app.post('/todos', checkUserCredentials(), createTodo)
app.delete('/todos/:id', checkUserCredentials(), deleteTodo)
app.put('/todos/:id', checkUserCredentials(), updateTodo)

// Stats
app.post('/events', checkUserCredentials(), createEvent)

app.get('/stats/events/login', checkUserCredentials(), getLoginEvents)
app.get('/stats/events/login/count', checkUserCredentials(), getLoginEventsCount)

app.get('/stats/events/register', checkUserCredentials(), getRegisterEvents)
app.get('/stats/events/register/count', checkUserCredentials(), getRegisterEventsCount)

app.get('/stats/events/grouped', checkUserCredentials(), getGroupedEvents)
app.get('/stats/events/grouped/login-register', checkUserCredentials(), getLoginRegisterGroupedEvents)

app.get('/stats/events/login/in-over-time', checkUserCredentials(), getLoginEventsInOverTime)
app.get('/stats/events/register/in-over-time', checkUserCredentials(), getRegisterEventsInOverTime)
app.get('/stats/events/navigation/in-over-time', checkUserCredentials(), getNavigationEventsInOverTime)

// Connect to database
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT)
  }).catch(error => {
    console.error('Could not connect to database', error)
  })