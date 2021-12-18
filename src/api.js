// Carga todas las variables de entorno usando la biblioteca dotenv
require('dotenv').config()

const mongoose = require('mongoose') // Mongoose (equivalente a Sequelize) es un mapeador para mongoDB
const mongooseToJson = require('@meanie/mongoose-to-json') // Este plugin limpieza las request en los campos _id y __v
const express = require('express')
const cors = require('cors')
const getDbConnectionString = require('./utils/get-db-connection-string') // Funcion que retorna el string de conexion

// Configuracion de plugins para la base de datos ---------------------------------------------------------------------------- //

mongoose.plugin(mongooseToJson) // Carga del plugin mongoosetojson en mongoose
 
// Creacion de app express ---------------------------------------------------------------------------- //

const app = express()

// Middlewares ---------------------------------------------------------------------------------------- //

const checkUserCredentials = require('./middlewares/check-user-credentials')
const checkUserRole = require('./middlewares/check-user-role')

// Cors retorna una funcion middleware que abre la API en terminos de seguridad, para poder conectarnos con el front-end al desarrollar (Permite conexiones entre una misma IP)
app.use(cors())

// Esta linea es para entender el JSON que se le envia a la API
app.use(express.json())

// Carga de controladores ----------------------------------------------------------------------------- //

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

// Definicion de rutas -------------------------------------------------------------------------------- //

// Security
app.get('/auth/mfa', checkUserCredentials(), enableMfa)  // Retorna el QR para mostrar al usuario
app.get('/auth/refresh', checkUserCredentials('REFRESH'), refresh)

// Users (Loguear, registrar y listar usuarios en el sistema)
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

// Usa las credenciales del string definido arriba para conectar
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Comenzar a escuchar por conexiones
    app.listen(process.env.PORT)
  }).catch(error => {
    console.error('No fue posible conectarse a la base de datos', error)
  })