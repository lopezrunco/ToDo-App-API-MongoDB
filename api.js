// Carga todas las variables de entorno usando la biblioteca dotenv
require('dotenv').config()


const mongoose = require('mongoose') // Mongoose (equivalente a Sequelize) es un mapeador para mongoDB
const express = require('express')
const cors = require('cors')

// Conexion a base de datos ---------------------------------------------------------------------------- //
// Dependiendo de si hay usuario y password crea un string, si no, otro
let databaseConnectionString
if (process.env.DB_USER && process.env.DB_PASSWORD) {
    databaseConnectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
} else {
    databaseConnectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
}
 
// Carga de modelos  ----------------------------------------------------------------------------------- //
// Se pasa sequelize como parametro para la definicion del modelo
const userModel = require('./models/user')(sequelize)
const todoModel = require('./models/todo')(sequelize)

// Creacion de app express ---------------------------------------------------------------------------- //

const app = express()

// Middlewares ---------------------------------------------------------------------------------------- //

const checkIfTheUserHasCredentials = require('./middlewares/check-if-the-user-has-credentials')

// Cors retorna una funcion middleware que abre la API en terminos de seguridad, para poder conectarnos con el front-end al desarrollar (Permite conexiones entre una misma IP)
app.use(cors())

// Esta linea es para entender el JSON que se le envia a la API
app.use(express.json())

// Carga de controladores ----------------------------------------------------------------------------- //

// Users
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')
const getAllUsers = require('./controllers/user/get-all')

// Todos
const getAllTodos = require('./controllers/todos/get-all')
const getTodoById = require('./controllers/todos/get-by-id')
const createTodo = require('./controllers/todos/create')
const deleteTodo = require('./controllers/todos/delete')
const updateTodo = require('./controllers/todos/update')

// Definicion de rutas -------------------------------------------------------------------------------- //

// Users (Loguear y registrar usuarios en el sistema)
app.post('/login', login(sequelize))
app.post('/registro', register(sequelize))
app.get('/admin/users', checkIfTheUserHasCredentials, getAllUsers(sequelize))

// Todos
app.get('/todos', checkIfTheUserHasCredentials, getAllTodos(sequelize))
app.get('/todos/:id', checkIfTheUserHasCredentials, getTodoById(sequelize))
app.post('/todos', checkIfTheUserHasCredentials, createTodo(sequelize))
app.delete('/todos/:id', checkIfTheUserHasCredentials, deleteTodo(sequelize))
app.put('/todos/:id', checkIfTheUserHasCredentials, updateTodo(sequelize))

// Usa las credenciales del string definido arriba para conectar
mongoose.connect(databaseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // Comenzar a escuchar por conexiones
    app.listen(process.env.API_PORT)
  }).catch(error => {
    console.error('No fue posible conectarse a la base de datos', error)
  })