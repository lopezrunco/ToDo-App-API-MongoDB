const eventTypes = require('../../models/event-types')
const { eventModel } = require('../../models/event')

// Obtiene solo los eventos de tipo LOGIN o REGISTER, los cuenta y los agrupa por tipo
module.exports = (request, response) => {
    eventModel
        .aggregate([{
            // Filtra por tipos de eventos LOGIN o REGISTER
            $match: {
                $or: [
                    { type: eventTypes.LOGIN },
                    { type: eventTypes.REGISTER }
                ]
            }
        }, {
            $group: {
                _id: '$type',
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {  
                _id: false,
                type: '$_id',
                count: 1
            }
        }])
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