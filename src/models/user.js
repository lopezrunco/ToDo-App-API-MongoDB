const { model, Schema } = require('mongoose')
const { todoSchema } = require('./todo')        // Importa el esquema de las tareas

// Con este cambio, de ahora en adelante para acceder a las tareas, se debera hacerlo a traves del usuario
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    todos: {
        type: [todoSchema],     // Se agrega el esquema de las tareas
        default: () => ([])     // Si el usuario no tiene tareas, se agrega una lista vacia por defecto
    },
    mfaEnabled: {
        type: Boolean,
        required: false
    },
    mfaSecret: {
        type: String,
        required: false
    }
})

const userModel = model('users', userSchema)

module.exports = {
    userSchema,
    userModel
}