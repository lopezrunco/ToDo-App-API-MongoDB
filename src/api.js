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

// Usa las credenciales del string definido arriba para conectar
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Comenzar a escuchar por conexiones
    app.listen(process.env.PORT)
  }).catch(error => {
    console.error('No fue posible conectarse a la base de datos', error)
  })