const eventTypes = require('../../models/event-types')
const { eventModel } = require('../../models/event')

// Retorna la cantidad de eventos de tipo REGISTER
module.exports = (request, response) => {
    eventModel
        .count({ type: eventTypes.REGISTER })
        .then(events => {
            response.status(200).json({
                events
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar obtener estadisticas'
            })
        })
}