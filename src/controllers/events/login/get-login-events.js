const eventTypes = require('../../../models/event-types')
const { eventModel } = require('../../../models/event')

// Retorna todos los eventos de tipo LOGIN
module.exports = (request, response) => {
    eventModel
        .find({ type: eventTypes.LOGIN })
        .select('-_id -context -type')
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