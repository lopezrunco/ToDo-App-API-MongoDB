// Carga todas las variables de entorno usando la biblioteca dotenv
require('dotenv').config()

const { Sequelize } = require('sequelize')
const express = require('express')
const cors = require('cors')

// Conexion a base de datos ---------------------------------------------------------------------------- //

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

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


// Funcion asincrona, primero se autentica y solo despues corre el codigo. Si no se autentica, arroja error.
sequelize
  .authenticate()
  .then(() => {
    // Sincroniza los modelos con la base de datos (Crea las tablas si no existen)
    sequelize
      .sync({ alter: true })
      .then(() => {
        // Comenzar a escuchar por conexiones
        app.listen(process.env.API_PORT)
      })
  })
  .catch(error => {
    console.error('No fue posible conectarse a la base de datos', error)
  })