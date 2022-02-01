const { Schema } = require('mongoose')

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    priority: {
        type: String,
        required: false,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false
    }
})

module.exports = {
    todoSchema
}