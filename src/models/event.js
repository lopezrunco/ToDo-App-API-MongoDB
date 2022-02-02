const { model, Schema } = require("mongoose")
const eventTypes = require("./event-types")

const eventSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(eventTypes),    // The values are enumerated, means that can be anyone of the eventTypes
        default: eventTypes.GENERIC,        // GENERIC is the value by default
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