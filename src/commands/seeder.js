// Utilidad para leer variables de entorno
require('dotenv').config()

// Dependencias externas a utilizar
const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string') // Funcion que retorna el string de conexion

// Importacion del modelo a utilizar
const { userModel } = require('../models/user')

const users = []
const userPassword = bcrypt.hashSync('super_super_secret', 2)

for (let numeroDeIteracion = 0; numeroDeIteracion < 10; numeroDeIteracion++) {
    const todos = []

    for (let numeroDeIteracion = 0; numeroDeIteracion < faker.datatype.number(5); numeroDeIteracion++) {
        todos.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            completed: faker.datatype.boolean(),
            priority: faker.random.arrayElement(['LOW', 'MID', 'HIGH']),
        })
    }

    users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: userPassword,
        todos: todos,
        mfaEnabled: false, 
        mfaSecret: '',
        role: numeroDeIteracion === 0 ? 'ADMIN' : 'BASIC'   // First user is ADMIN, the others is BASIC
    })
}

console.log('------------------------------------------------------------------------')
console.log('Seed de datos')
console.log('------------------------------------------------------------------------')
console.log('Se van a insertar:')
console.log(`${users.length} Usuarios`)

// Conection to database
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Promise.all acepts a collection of promises
        Promise.all([
            userModel.insertMany(users)
        ]).then(() => {
            console.log('Listo!')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database', error)
    })