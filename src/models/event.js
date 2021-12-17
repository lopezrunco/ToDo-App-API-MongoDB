const { model, Schema } = require("mongoose")
const eventTypes = require("./event-types")

const eventSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(eventTypes),    // Los valores son enumerados, o sea que puede ser cualquier de los que estan en eventTypes
        default: eventTypes.GENERIC,        // GENERIC es el valor por defecto
        required: true
    },
    context: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const eventModel = model('events', eventSchema)

module.exports = {
    eventSchema,
    eventModel
}