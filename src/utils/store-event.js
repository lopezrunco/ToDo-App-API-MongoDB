const { eventModel } = require('../models/event')

module.exports = (event) => {
    return eventModel.create(event)
}