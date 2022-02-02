const { model, Schema } = require('mongoose')
const { todoSchema } = require('./todo')

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
        type: [todoSchema],
        default: () => ([])     // If the users does not have todos, add an empty list by default
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