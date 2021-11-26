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

const checkIfTheUserHasCredentials = require('./middlewares/check-if-the-user-has-credentials')
const checkUserRole = require('./middlewares/check-user-role')

// Cors retorna una funcion middleware que abre la API en terminos de seguridad, para poder conectarnos con el front-end al desarrollar (Permite conexiones entre una misma IP)
app.use(cors())

// Esta linea es para entender el JSON que se le envia a la API
app.use(express.json())

// Carga de controladores ----------------------------------------------------------------------------- //

// Users
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')
const enableMfa = require('./controllers/user/enable-mfa')
const getAllUsers = require('./controllers/user/get-all')

// Todos
const getAllTodos = require('./controllers/todos/get-all')
const getTodoById = require('./controllers/todos/get-by-id')
const createTodo = require('./controllers/todos/create')
const deleteTodo = require('./controllers/todos/delete')
const updateTodo = require('./controllers/todos/update')

// Definicion de rutas -------------------------------------------------------------------------------- //

// Users (Loguear y registrar usuarios en el sistema)
app.post('/login', login)
app.post('/registro', register)
app.get('/mfa', checkIfTheUserHasCredentials, enableMfa)  // Esta retorna retorna el QR para mostrar al usuario
app.get('/admin/users', checkIfTheUserHasCredentials, checkUserRole(['ADMIN']), getAllUsers)

// Todos
app.get('/todos', checkIfTheUserHasCredentials, getAllTodos)
app.get('/todos/:id', checkIfTheUserHasCredentials, getTodoById)
app.post('/todos', checkIfTheUserHasCredentials, createTodo)
app.delete('/todos/:id', checkIfTheUserHasCredentials, deleteTodo)
app.put('/todos/:id', checkIfTheUserHasCredentials, updateTodo)

// Usa las credenciales del string definido arriba para conectar
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Comenzar a escuchar por conexiones
    app.listen(process.env.API_PORT)
  }).catch(error => {
    console.error('No fue posible conectarse a la base de datos', error)
  })