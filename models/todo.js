const { model, Schema } = require('mongoose')

module.exports = model('todos', new Schema({
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
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false
    }
}))