// Utilidad para leer variables de entorno
require('dotenv').config()

// Dependencias externas a utilizar
const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string') // Funcion que retorna el string de conexion

// Importacion del modelo a utilizar
const { userModel } = require('../models/user')

// Declaracion de las listas de documentos a insertar en las colecciones
const users = []

// Password que se utilizara en los usuarios a crear
const userPassword = bcrypt.hashSync('super_super_secret', 2)

// Genera una lista de usuarios haciendo uso de faker.js
for (let numeroDeIteracion = 0; numeroDeIteracion < 10; numeroDeIteracion++) {
    const todos = []

    // Genera una lista de todos haciendo uso de faker.js. Las mismas se generaran dentro de cada usuario
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
        todos: todos,   // Se agregan las tareas al usuario
        mfaEnabled: false, 
        mfaSecret: '',
        role: numeroDeIteracion === 0 ? 'ADMIN' : 'BASIC'   // El primer usuario sera ADMIN, el resto seran BASIC
    })
}

// Muestra en la consola informacion sobre la inserción de datos
console.log('------------------------------------------------------------------------')
console.log('Seed de datos')
console.log('------------------------------------------------------------------------')
console.log('Se van a insertar:')
console.log(`${users.length} Usuarios`)

// Conexion a la base de datos
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Promise.all acepta una coleccion de promesas
        Promise.all([
            // Inserta todos los usuarios y tareas
            userModel.insertMany(users)
        ]).then(() => {
            // Una vez que terminan de insertarse todos los documentos, cierra la conexion a mongodb
            console.log('Listo!')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
    })